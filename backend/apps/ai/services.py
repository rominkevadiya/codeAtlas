import os
import json
import logging
import google.generativeai as genai
from django.conf import settings
from apps.repositories.models import Repository

logger = logging.getLogger(__name__)

# ── Lazy Gemini client — initialized once on first use, not on every request ──
_gemini_model = None

def _get_gemini_model():
    """Return a cached Gemini model instance, configuring the API key on first call."""
    global _gemini_model
    if _gemini_model is None:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured in settings.")
        genai.configure(api_key=api_key)
        _gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        logger.info("Gemini model initialized successfully.")
    return _gemini_model


class AIService:
    @staticmethod
    def query_repository(repository_id: str, query: str) -> str:
        """
        Query a repository using Gemini AI based on its knowledge graph.
        """
        try:
            repo = Repository.objects.get(id=repository_id)
        except Repository.DoesNotExist:
            raise ValueError(f"Repository with id {repository_id} does not exist.")

        if not repo.local_path:
            raise ValueError("Repository local path is missing.")

        graph_path = os.path.join(repo.local_path, 'knowledge_graph.json')
        if not os.path.exists(graph_path):
            raise ValueError("Knowledge graph not found. Has the repository been fully parsed?")

        try:
            with open(graph_path, 'r', encoding='utf-8') as f:
                graph_data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load knowledge graph: {e}")
            raise ValueError("Failed to load knowledge graph data.")

        # Serialize graph — truncate if too large to avoid token limit issues
        graph_str = json.dumps(graph_data)
        if len(graph_str) > 50000:
            # Simple truncation for the prototype; future: use RAG / embeddings
            graph_str = graph_str[:50000] + "\n... (graph truncated due to size)"

        prompt = f"""
You are an expert software developer and code architecture analyzer.
I will provide you with a JSON representation of a code knowledge graph for a repository named '{repo.name}'.
The graph contains nodes (files, classes, functions) and edges (contains, imports, calls, etc.).

Knowledge Graph:
{graph_str}

User Question:
{query}

Please answer the user's question clearly and concisely based ONLY on the provided knowledge graph.
If the information is not present in the graph, state that you cannot answer it based on the available parsed data.
"""

        try:
            model = _get_gemini_model()
            response = model.generate_content(prompt)
            return response.text
        except ValueError:
            raise  # re-raise config errors as-is
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise ValueError(f"Failed to generate response from AI: {str(e)}")
