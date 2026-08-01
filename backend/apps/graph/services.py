import networkx as nx
from networkx.readwrite import json_graph

class GraphService:
    @staticmethod
    def build_graph(parsed_data):
        """
        Builds a NetworkX graph from the parsed entities and relationships.
        Returns the graph in a node-link JSON format.
        """
        G = nx.DiGraph()
        
        entities = parsed_data.get("entities", [])
        relationships = parsed_data.get("relationships", [])
        
        for entity in entities:
            G.add_node(entity["id"], **entity)
            
        for rel in relationships:
            if rel["target"] not in G:
                G.add_node(rel["target"], id=rel["target"], name=rel["target"], type="module", is_external=True)
            G.add_edge(rel["source"], rel["target"], type=rel["type"])
            
        return json_graph.node_link_data(G)
