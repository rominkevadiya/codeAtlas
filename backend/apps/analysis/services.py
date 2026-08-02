import os
import json
import networkx as nx
from networkx.readwrite import json_graph
from django.conf import settings
from apps.common.exceptions import CodeAtlasException
from apps.repositories.models import Repository

class MetricsService:
    @staticmethod
    def calculate_metrics(repository_id):
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
            G = json_graph.node_link_graph(data)
        except Exception as e:
            raise CodeAtlasException(f"Failed to load graph: {str(e)}", code="GRAPH_LOAD_ERROR", status_code=500)

        # Separate nodes by type
        file_nodes = [n for n, attr in G.nodes(data=True) if attr.get("type") == "file"]
        
        # 1. God Classes / Giant Files
        # We can calculate LOC (Lines of Code) from start_line and end_line
        file_metrics = []
        for fn in file_nodes:
            attr = G.nodes[fn]
            start_line = attr.get("start_line", 0)
            end_line = attr.get("end_line", 0)
            loc = end_line - start_line + 1 if end_line >= start_line else 0
            
            # Count functions/classes contained in this file
            contains_count = 0
            for u, v, e_data in G.out_edges(fn, data=True):
                if e_data.get("type") == "contains":
                    contains_count += 1
                    
            file_metrics.append({
                "id": fn,
                "name": attr.get("name", fn),
                "loc": loc,
                "contains_count": contains_count
            })

        # Sort by LOC (descending) and take top 10
        top_giant_files = sorted(file_metrics, key=lambda x: x["loc"], reverse=True)[:10]
        
        # 2. Coupling Analysis (Inbound/Outbound imports)
        # We will build an imports subgraph
        import_edges = [(u, v) for u, v, attr in G.edges(data=True) if attr.get("type") == "imports"]
        imports_graph = nx.DiGraph()
        imports_graph.add_edges_from(import_edges)
        
        coupling_metrics = []
        for fn in file_nodes:
            if fn in imports_graph:
                in_degree = imports_graph.in_degree(fn)
                out_degree = imports_graph.out_degree(fn)
            else:
                in_degree = 0
                out_degree = 0
                
            coupling_metrics.append({
                "id": fn,
                "name": G.nodes[fn].get("name", fn),
                "inbound_imports": in_degree,
                "outbound_imports": out_degree,
                "total_coupling": in_degree + out_degree
            })
            
        top_coupled_files = sorted(coupling_metrics, key=lambda x: x["total_coupling"], reverse=True)[:10]
        
        # 3. Circular Dependency Detection
        # Find cycles in the imports_graph
        cycles = []
        try:
            # simple_cycles can be expensive on very large graphs, limit to finding a few
            # or use recursive_simple_cycles for NetworkX >= 2.8, but simple_cycles is standard
            # To avoid hanging on huge graphs, we might want to restrict or timeout, but we'll try it directly.
            # Convert simple_cycles generator to a list, limit to 20 cycles
            cycle_gen = nx.simple_cycles(imports_graph)
            for i, cycle in enumerate(cycle_gen):
                if i >= 20:
                    break
                if len(cycle) > 1: # Ignore self-imports if any
                    cycles.append(cycle)
        except Exception:
            pass

        # 4. Architectural Hotspots (PageRank)
        # Identifies the most critical files based on dependency graph centrality
        hotspots = []
        try:
            pr = nx.pagerank(imports_graph)
            sorted_pr = sorted(pr.items(), key=lambda x: x[1], reverse=True)[:10]
            for node_id, score in sorted_pr:
                hotspots.append({
                    "id": node_id,
                    "name": G.nodes[node_id].get("name", node_id),
                    "score": round(score, 4)
                })
        except Exception:
            pass

        # 5. Potential Dead Code (Orphaned Files)
        # Files with 0 inbound imports (excluding typical entry points)
        dead_code_candidates = []
        for fn in file_nodes:
            if fn in imports_graph and imports_graph.in_degree(fn) == 0:
                name = G.nodes[fn].get("name", fn).lower()
                # Exclude common entrypoints
                if not any(entry in name for entry in ['main', 'index', 'app', 'manage', 'setup', 'wsgi', 'asgi', 'urls']):
                    dead_code_candidates.append({
                        "id": fn,
                        "name": G.nodes[fn].get("name", fn)
                    })
        
        # Limit to top 15 dead code candidates to avoid overwhelming output
        dead_code_candidates = dead_code_candidates[:15]

        return {
            "top_giant_files": top_giant_files,
            "top_coupled_files": top_coupled_files,
            "circular_dependencies": cycles,
            "architectural_hotspots": hotspots,
            "dead_code_candidates": dead_code_candidates
        }

    @staticmethod
    def calculate_blast_radius(repository_id, node_id):
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
            G = nx.DiGraph(json_graph.node_link_graph(data))
        except Exception as e:
            raise CodeAtlasException(f"Failed to load graph: {str(e)}", code="GRAPH_LOAD_ERROR", status_code=500)

        if node_id not in G:
            raise CodeAtlasException("Node not found in graph", code="NODE_NOT_FOUND", status_code=404)

        # Forward dependencies (things this node depends on)
        forward_edges = list(nx.bfs_edges(G, source=node_id))
        forward_nodes = set([v for u, v in forward_edges])
        
        # Backward dependencies (impacted nodes - things that depend on this node)
        # Reverse graph to find ancestors
        R = G.reverse(copy=False)
        backward_edges = list(nx.bfs_edges(R, source=node_id))
        backward_nodes = set([v for u, v in backward_edges])

        # Formatting results
        impacted = []
        for n in backward_nodes:
            impacted.append({
                "id": n,
                "name": G.nodes[n].get("name", n),
                "type": G.nodes[n].get("type", "unknown"),
                "file_path": G.nodes[n].get("file_path", "")
            })

        dependencies = []
        for n in forward_nodes:
            dependencies.append({
                "id": n,
                "name": G.nodes[n].get("name", n),
                "type": G.nodes[n].get("type", "unknown"),
                "file_path": G.nodes[n].get("file_path", "")
            })

        return {
            "node_id": node_id,
            "impacted_nodes": impacted,
            "dependency_nodes": dependencies,
            "impact_score": len(impacted)
        }
