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
        Traverses a repository directory, parses supported source files, and extracts AST entities.
        Generates a structured dictionary of code nodes and their relational edges for knowledge graph construction.
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
        """
        Extracts structural entities (e.g., classes, functions) and dependencies (e.g., imports) from AST nodes.
        Recursively traverses the syntax tree to build the internal graph representation.
        """
        entities = []
        relationships = []
        
        def _get_name_node(node, valid_types):
            return next((c for c in node.children if c.type in valid_types), None)

        def _add_entity(node, name_node, entity_type):
            if name_node and name_node.text:
                name = name_node.text.decode('utf-8')
                entity_id = f"{file_path}:{name}"
                entities.append({
                    "id": entity_id, "type": entity_type, "name": name, "file_path": file_path,
                    "start_line": getattr(node, 'start_point', [0])[0],
                    "end_line": getattr(node, 'end_point', [0])[0],
                })
                relationships.append({"source": file_path, "target": entity_id, "type": "contains"})

        def traverse(node):
            if node.type in ['class_definition', 'class_declaration']:
                name_node = _get_name_node(node, ['identifier', 'type_identifier'])
                _add_entity(node, name_node, "class")
            
            elif node.type in ['function_definition', 'function_declaration', 'method_definition', 'arrow_function']:
                if node.type != 'arrow_function':
                    name_node = _get_name_node(node, ['identifier', 'property_identifier'])
                    _add_entity(node, name_node, "function")
                    
            elif node.type in ['import_statement', 'import_from_statement', 'import_clause']:
                for child in node.children:
                    if child.type in ['dotted_name', 'identifier', 'string', 'string_fragment'] and child.text:
                        module_name = child.text.decode('utf-8').strip('\'"')
                        if module_name not in ['import', 'from']:
                            relationships.append({"source": file_path, "target": module_name, "type": "imports"})
                        break
                        
            for child in node.children:
                traverse(child)

        traverse(root_node)
        return entities, relationships
