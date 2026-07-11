import os
import tree_sitter_python
from tree_sitter import Language, Parser

# Initialize Tree-sitter Language
PY_LANGUAGE = Language(tree_sitter_python.language())
parser = Parser(PY_LANGUAGE)

class ParserService:
    @staticmethod
    def parse_repository(local_path):
        """
        Traverses a repository directory, parses Python files, and extracts AST entities.
        Returns a dictionary of nodes and edges for graph construction.
        """
        entities = []
        relationships = []
        
        for root, _, files in os.walk(local_path):
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, local_path)
                    
                    with open(file_path, 'r', encoding='utf-8') as f:
                        source_code = f.read()
                        
                    tree = parser.parse(bytes(source_code, "utf8"))
                    
                    # File entity
                    entities.append({
                        "id": rel_path,
                        "type": "file",
                        "name": rel_path
                    })
                    
                    # Extract entities from the tree
                    file_entities, file_relationships = ParserService._extract_entities_from_ast(tree.root_node, source_code, rel_path)
                    
                    entities.extend(file_entities)
                    relationships.extend(file_relationships)
                    
        return {
            "entities": entities,
            "relationships": relationships
        }

    @staticmethod
    def _extract_entities_from_ast(root_node, source_code, file_path):
        entities = []
        relationships = []
        
        def traverse(node):
            if node.type == 'class_definition':
                # find the identifier child for class name
                name_node = None
                for child in node.children:
                    if child.type == 'identifier':
                        name_node = child
                        break
                
                if name_node and name_node.text:
                    class_name = name_node.text.decode('utf-8')
                    entity_id = f"{file_path}:{class_name}"
                    entities.append({
                        "id": entity_id,
                        "type": "class",
                        "name": class_name,
                        "file_path": file_path
                    })
                    relationships.append({
                        "source": file_path,
                        "target": entity_id,
                        "type": "contains"
                    })
            elif node.type == 'function_definition':
                name_node = None
                for child in node.children:
                    if child.type == 'identifier':
                        name_node = child
                        break
                
                if name_node and name_node.text:
                    func_name = name_node.text.decode('utf-8')
                    entity_id = f"{file_path}:{func_name}"
                    entities.append({
                        "id": entity_id,
                        "type": "function",
                        "name": func_name,
                        "file_path": file_path
                    })
                    relationships.append({
                        "source": file_path,
                        "target": entity_id,
                        "type": "contains"
                    })
            elif node.type in ['import_statement', 'import_from_statement']:
                # simplistic extraction: find any dotted_name
                for child in node.children:
                    if (child.type == 'dotted_name' or child.type == 'identifier') and child.text:
                        module_name = child.text.decode('utf-8')
                        if module_name != 'import' and module_name != 'from':
                            relationships.append({
                                "source": file_path,
                                "target": module_name,
                                "type": "imports"
                            })
                        break
                        
            for child in node.children:
                traverse(child)

        traverse(root_node)
        return entities, relationships
