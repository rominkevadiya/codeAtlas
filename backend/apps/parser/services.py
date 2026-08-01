import os
import tree_sitter_python
import tree_sitter_javascript
import tree_sitter_typescript
import tree_sitter_json
from tree_sitter import Language, Parser

# Initialize Tree-sitter Languages
PY_LANGUAGE = Language(tree_sitter_python.language())
JS_LANGUAGE = Language(tree_sitter_javascript.language())
TS_LANGUAGE = Language(tree_sitter_typescript.language_typescript())
TSX_LANGUAGE = Language(tree_sitter_typescript.language_tsx())
JSON_LANGUAGE = Language(tree_sitter_json.language())

# Create parsers mapping
PARSERS = {
    '.py': Parser(PY_LANGUAGE),
    '.js': Parser(JS_LANGUAGE),
    '.jsx': Parser(TSX_LANGUAGE),
    '.ts': Parser(TS_LANGUAGE),
    '.tsx': Parser(TSX_LANGUAGE),
    '.json': Parser(JSON_LANGUAGE),
    '.ejs': None, # Supported as a file node, but no deep AST parsing currently
}

IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', '.venv', 'venv', '__pycache__', 'coverage', '.next'}

class ParserService:
    @staticmethod
    def parse_repository(local_path):
        """
        Traverses a repository directory, parses files, and extracts AST entities.
        Returns a dictionary of nodes and edges for graph construction.
        """
        entities = []
        relationships = []
        
        for root, dirs, files in os.walk(local_path):
            # Exclude node_modules, env dirs, etc.
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
            
            for file in files:
                # Do not check env or config files
                if 'env' in file.lower():
                    continue
                    
                ext = os.path.splitext(file)[1].lower()
                if ext in PARSERS:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, local_path)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            source_code = f.read()
                    except Exception:
                        continue # Skip unreadable files
                        
                    # File entity
                    entities.append({
                        "id": rel_path,
                        "type": "file",
                        "name": rel_path,
                        "start_line": 0,
                        "end_line": len(source_code.splitlines()) - 1
                    })
                    
                    parser = PARSERS[ext]
                    if parser:
                        try:
                            tree = parser.parse(bytes(source_code, "utf8"))
                            file_entities, file_relationships = ParserService._extract_entities_from_ast(tree.root_node, source_code, rel_path)
                            entities.extend(file_entities)
                            relationships.extend(file_relationships)
                        except Exception:
                            pass # Silently skip AST parsing errors for individual files
                            
        return {
            "entities": entities,
            "relationships": relationships
        }

    @staticmethod
    def _extract_entities_from_ast(root_node, source_code, file_path):
        entities = []
        relationships = []
        
        def traverse(node):
            node_type = node.type
            
            if node_type in ['class_definition', 'class_declaration']:
                name_node = None
                for child in node.children:
                    if child.type in ['identifier', 'type_identifier']:
                        name_node = child
                        break
                
                if name_node and name_node.text:
                    class_name = name_node.text.decode('utf-8')
                    entity_id = f"{file_path}:{class_name}"
                    entities.append({
                        "id": entity_id,
                        "type": "class",
                        "name": class_name,
                        "file_path": file_path,
                        "start_line": node.start_point[0] if hasattr(node, 'start_point') else 0,
                        "end_line": node.end_point[0] if hasattr(node, 'end_point') else 0,
                    })
                    relationships.append({
                        "source": file_path,
                        "target": entity_id,
                        "type": "contains"
                    })
            
            elif node_type in ['function_definition', 'function_declaration', 'method_definition', 'arrow_function']:
                name_node = None
                
                # For arrow functions, we would normally look at the parent VariableDeclarator to get the name.
                # To keep things robust without getting too complex, we look for simple identifiers in the children.
                if node_type != 'arrow_function':
                    for child in node.children:
                        if child.type in ['identifier', 'property_identifier']:
                            name_node = child
                            break
                
                if name_node and name_node.text:
                    func_name = name_node.text.decode('utf-8')
                    entity_id = f"{file_path}:{func_name}"
                    entities.append({
                        "id": entity_id,
                        "type": "function",
                        "name": func_name,
                        "file_path": file_path,
                        "start_line": node.start_point[0] if hasattr(node, 'start_point') else 0,
                        "end_line": node.end_point[0] if hasattr(node, 'end_point') else 0,
                    })
                    relationships.append({
                        "source": file_path,
                        "target": entity_id,
                        "type": "contains"
                    })
                    
            elif node_type in ['import_statement', 'import_from_statement', 'import_clause']:
                for child in node.children:
                    # In JS, imports often use string literals for paths
                    if child.type in ['dotted_name', 'identifier', 'string', 'string_fragment'] and child.text:
                        module_name = child.text.decode('utf-8').strip('\'"')
                        if module_name not in ['import', 'from']:
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
