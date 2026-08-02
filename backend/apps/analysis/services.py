import os
import json
import networkx as nx
from networkx.readwrite import json_graph
from django.conf import settings
from apps.common.exceptions import CodeAtlasException
from apps.repositories.models import Repository

class MetricsService:
    @staticmethod
    def _get_graph(repository_id: str):
        """
        Loads and reconstructs the NetworkX knowledge graph for a given repository.
        Returns the parsed graph object for further structural analysis.
        """
        try:
            repo = Repository.objects.get(id=repository_id)
        except Repository.DoesNotExist:
            raise CodeAtlasException("Repository not found", code="REPO_NOT_FOUND", status_code=404)

        graph_path = os.path.join(repo.local_path, "knowledge_graph.json")
        if not os.path.exists(graph_path):
            raise CodeAtlasException("Knowledge graph not found", code="GRAPH_NOT_FOUND", status_code=404)

        try:
            with open(graph_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return json_graph.node_link_graph(data)
        except Exception as e:
            raise CodeAtlasException(f"Failed to load graph: {str(e)}", code="GRAPH_LOAD_ERROR", status_code=500)

    @staticmethod
    def _calc_giant_files(G, file_nodes):
        """
        Calculates file size and complexity metrics across the repository.
        Identifies 'giant' files based on lines of code and internal entity count.
        """
        metrics = []
        for fn in file_nodes:
            attr = G.nodes[fn]
            start_line, end_line = attr.get("start_line", 0), attr.get("end_line", 0)
            loc = max(0, end_line - start_line + 1)
            contains_count = sum(1 for _, _, e_data in G.out_edges(fn, data=True) if e_data.get("type") == "contains")
            
            metrics.append({"id": fn, "name": attr.get("name", fn), "loc": loc, "contains_count": contains_count})
        return sorted(metrics, key=lambda x: x["loc"], reverse=True)[:10]

    @staticmethod
    def _calc_coupling_and_imports(G, file_nodes):
        """
        Builds a dedicated import dependency graph.
        Calculates inbound and outbound coupling metrics to identify highly dependent files.
        """
        import_edges = [(u, v) for u, v, attr in G.edges(data=True) if attr.get("type") == "imports"]
        imports_graph = nx.DiGraph(import_edges)
        
        metrics = []
        for fn in file_nodes:
            in_deg = imports_graph.in_degree(fn) if fn in imports_graph else 0
            out_deg = imports_graph.out_degree(fn) if fn in imports_graph else 0
            metrics.append({
                "id": fn, "name": G.nodes[fn].get("name", fn),
                "inbound_imports": in_deg, "outbound_imports": out_deg, "total_coupling": in_deg + out_deg
            })
        return sorted(metrics, key=lambda x: x["total_coupling"], reverse=True)[:10], imports_graph

    @staticmethod
    def _find_circular_deps(imports_graph):
        """
        Detects cyclic dependencies within the import graph.
        Limits the search to the first 20 cycles to prevent excessive computation time.
        """
        cycles = []
        try:
            for i, cycle in enumerate(nx.simple_cycles(imports_graph)):
                if i >= 20: break
                if len(cycle) > 1: cycles.append(cycle)
        except Exception:
            pass
        return cycles

    @staticmethod
    def _find_hotspots(G, imports_graph):
        """
        Identifies architectural hotspots using the PageRank algorithm.
        Highlights files that act as critical hubs in the dependency network.
        """
        try:
            pr = nx.pagerank(imports_graph)
            return [{"id": n, "name": G.nodes[n].get("name", n), "score": round(s, 4)} 
                    for n, s in sorted(pr.items(), key=lambda x: x[1], reverse=True)[:10]]
        except Exception:
            return []

    @staticmethod
    def _find_dead_code(G, file_nodes, imports_graph):
        """
        Finds files with no inbound imports, excluding common entrypoints.
        Helps identify potential dead code or isolated modules.
        """
        candidates = []
        entrypoints = ['main', 'index', 'app', 'manage', 'setup', 'wsgi', 'asgi', 'urls']
        for fn in file_nodes:
            if fn in imports_graph and imports_graph.in_degree(fn) == 0:
                name = G.nodes[fn].get("name", fn)
                if not any(e in name.lower() for e in entrypoints):
                    candidates.append({"id": fn, "name": name})
        return candidates[:15]

    @staticmethod
    def calculate_metrics(repository_id):
        G = MetricsService._get_graph(repository_id)
        file_nodes = [n for n, attr in G.nodes(data=True) if attr.get("type") == "file"]
        
        giant_files = MetricsService._calc_giant_files(G, file_nodes)
        coupled_files, imports_graph = MetricsService._calc_coupling_and_imports(G, file_nodes)
        
        return {
            "top_giant_files": giant_files,
            "top_coupled_files": coupled_files,
            "circular_dependencies": MetricsService._find_circular_deps(imports_graph),
            "architectural_hotspots": MetricsService._find_hotspots(G, imports_graph),
            "dead_code_candidates": MetricsService._find_dead_code(G, file_nodes, imports_graph)
        }

    @staticmethod
    def calculate_blast_radius(repository_id, node_id):
        """
        Calculates the impact (blast radius) of modifying a specific node.
        Performs forward and backward BFS traversal to find all dependent and impacted nodes.
        """
        G = MetricsService._get_graph(repository_id)
        if node_id not in G:
            raise CodeAtlasException("Node not found in graph", code="NODE_NOT_FOUND", status_code=404)

        G_dir = nx.DiGraph(G)
        
        # Forward/Backward BFS
        forward_nodes = {v for _, v in nx.bfs_edges(G_dir, source=node_id)}
        backward_nodes = {v for _, v in nx.bfs_edges(G_dir.reverse(copy=False), source=node_id)}

        def format_nodes(nodes):
            return [{"id": n, "name": G.nodes[n].get("name", n), 
                     "type": G.nodes[n].get("type", "unknown"), "file_path": G.nodes[n].get("file_path", "")} 
                    for n in nodes]

        impacted = format_nodes(backward_nodes)
        return {
            "node_id": node_id,
            "impacted_nodes": impacted,
            "dependency_nodes": format_nodes(forward_nodes),
            "impact_score": len(impacted)
        }
