import os
import json
import logging
from google import genai
from django.conf import settings
from apps.repositories.models import Repository

logger = logging.getLogger(__name__)

# ── Lazy Gemini client — initialized once on first use, not on every request ──
_gemini_client = None

def _get_gemini_client():
    """Return a cached Gemini client instance, configuring the API key on first call."""
    global _gemini_client
    if _gemini_client is None:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured in settings.")
        _gemini_client = genai.Client(api_key=api_key)
        logger.info("Gemini client initialized successfully.")
    return _gemini_client


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
You are a senior principal engineer and architectural assistant helping a developer understand their codebase.
Below is the structural data (files, classes, functions, and their connections) extracted from their repository named '{repo.name}'.

Codebase Architecture Data:
{graph_str}

User Question:
{query}

Instructions:
1. Answer the user's question conversationally, directly, and naturally.
2. Act as if you are intimately familiar with this codebase. 
3. DO NOT use phrases like "Based on the provided knowledge graph..." or "The graph indicates...". Just give the answer directly based on the data you see.
4. If you don't have the specific answer in the architecture, feel free to say so clearly.
"""

        try:
            client = _get_gemini_client()
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text
        except ValueError:
            raise  # re-raise config errors as-is
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise ValueError(f"Failed to generate response from AI: {str(e)}")

    @staticmethod
    def query_repository_with_context(repository_id: str, query: str, conversation_context: str = "") -> str:
        """
        Query a repository using Gemini AI, including multi-turn conversation context.
        Used by the persistent chat history feature.
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

        graph_str = json.dumps(graph_data)
        if len(graph_str) > 50000:
            graph_str = graph_str[:50000] + "\n... (graph truncated due to size)"

        context_section = ""
        if conversation_context:
            context_section = f"""
Previous Conversation:
{conversation_context}
"""

        prompt = f"""
You are a senior principal engineer and architectural assistant helping a developer understand their codebase named '{repo.name}'.

Codebase Architecture Data:
{graph_str}
{context_section}
Current Question:
{query}

Instructions:
1. Answer the user's question conversationally and directly.
2. Use the previous conversation for context if relevant (for follow-up questions).
3. DO NOT use phrases like "Based on the provided knowledge graph...". Just answer directly.
4. If you don't have the specific answer, say so clearly.
"""

        try:
            client = _get_gemini_client()
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Gemini API error (context): {e}")
            raise ValueError(f"Failed to generate response from AI: {str(e)}")

    @staticmethod
    def explain_node(repository_id: str, node_name: str, node_type: str, snippet: str) -> str:
        """
        Explain a specific code node (file, class, function) using its source snippet.
        """
        prompt = f"""
You are an expert software developer.
Please explain the following {node_type} named '{node_name}'.

Source Code:
{snippet}

Provide a clear, concise explanation of what this code does, its main logic, and its purpose.
Act as if you are intimately familiar with this codebase.
Do not use phrases like "Based on the provided snippet..." just answer directly.
"""
        try:
            client = _get_gemini_client()
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Gemini API error (explain): {e}")
            raise ValueError(f"Failed to generate explanation from AI: {str(e)}")
