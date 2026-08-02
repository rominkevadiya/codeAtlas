from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from apps.ai.serializers import AIQuerySerializer, ChatSessionSerializer, ChatSessionListSerializer, ChatMessageSerializer
from apps.ai.services import AIService
from apps.ai.models import ChatSession, ChatMessage, ArchitectureDocument
from apps.ai.throttles import AIQueryAnonThrottle, AIQueryUserThrottle


class AIQueryView(APIView):
    """
    API endpoint to query a repository using Gemini AI.
    Rate-limited to prevent Gemini API quota abuse.
    """
    throttle_classes = [AIQueryAnonThrottle, AIQueryUserThrottle]

    def post(self, request, *args, **kwargs):
        serializer = AIQuerySerializer(data=request.data)
        if serializer.is_valid():
            repository_id = serializer.validated_data['repository_id']
            query = serializer.validated_data['query']

            try:
                answer = AIService.query_repository(repository_id=str(repository_id), query=query)
                return Response({"answer": answer}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": "An internal server error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AIExplainNodeView(APIView):
    """
    POST /api/v1/ai/explain/
    Request body: { "repository_id": "...", "node_name": "...", "node_type": "...", "snippet": "..." }
    """
    throttle_scope = 'ai_query'

    def post(self, request):
        repository_id = request.data.get('repository_id')
        node_name = request.data.get('node_name')
        node_type = request.data.get('node_type')
        snippet = request.data.get('snippet')

        if not all([repository_id, node_name, node_type, snippet]):
            return Response(
                {"error": "repository_id, node_name, node_type, and snippet are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            explanation = AIService.explain_node(repository_id, node_name, node_type, snippet)
            return Response({"explanation": explanation}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An internal error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────── Chat History Endpoints ───────────────────────────

class ChatSessionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/ai/chat/?repository_id=<uuid>  → List sessions for a repo
    POST /api/v1/ai/chat/                        → Create a new session
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ChatSessionListSerializer
        return ChatSessionSerializer

    def get_queryset(self):
        repo_id = self.request.query_params.get('repository_id')
        qs = ChatSession.objects.filter(user=self.request.user)
        if repo_id:
            qs = qs.filter(repository_id=repo_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatSessionDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/v1/ai/chat/<session_id>/  → Get session with all messages
    DELETE /api/v1/ai/chat/<session_id>/  → Delete session
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'session_id'

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)


class ChatSendMessageView(APIView):
    """
    POST /api/v1/ai/chat/<session_id>/send/
    Body: { "content": "user message text" }

    - Saves user message
    - Fetches AI reply with conversation context (last 10 messages)
    - Saves AI reply
    - Returns both messages
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIQueryUserThrottle]

    def post(self, request, session_id):
        try:
            session = ChatSession.objects.get(id=session_id, user=request.user)
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found."}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({"error": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the user message
        user_msg = ChatMessage.objects.create(
            session=session,
            role=ChatMessage.Role.USER,
            content=content,
        )

        # Build conversation history context (last 10 messages)
        history = session.messages.order_by('created_at')[max(0, session.messages.count() - 10):]
        conversation_context = "\n".join([
            f"{m.role.upper()}: {m.content}" for m in history
        ])

        try:
            ai_answer = AIService.query_repository_with_context(
                repository_id=session.repository_id,
                query=content,
                conversation_context=conversation_context,
            )
        except ValueError as e:
            ai_answer = f"I couldn't process that: {str(e)}"
        except Exception:
            ai_answer = "Sorry, I encountered an internal error. Please try again."

        # Save the AI response
        ai_msg = ChatMessage.objects.create(
            session=session,
            role=ChatMessage.Role.ASSISTANT,
            content=ai_answer,
        )

        # Touch session's updated_at
        session.save(update_fields=['updated_at'])

        return Response({
            "user_message": ChatMessageSerializer(user_msg).data,
            "assistant_message": ChatMessageSerializer(ai_msg).data,
        }, status=status.HTTP_200_OK)


class ArchitectureDocView(APIView):
    """
    GET  /api/v1/ai/autodoc/<repo_id>/  → Get existing persisted auto-doc
    POST /api/v1/ai/autodoc/<repo_id>/ → Generate or regenerate auto-doc and save to DB
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, repository_id):
        doc = ArchitectureDocument.objects.filter(user=request.user, repository_id=repository_id).first()
        if not doc:
            return Response({"content": None})
        return Response({"content": doc.content, "updated_at": doc.updated_at})

    def post(self, request, repository_id):
        prompt = (
            "You are an expert Software Architect. Analyze the provided repository graph data "
            "and write a comprehensive, high-level ARCHITECTURE.md document. Summarize the main domain modules, "
            "key entry points, architectural patterns, and dependencies. Format entirely in professional Markdown "
            "with clear headings. Do not output anything except the Markdown document."
        )
        try:
            content = AIService.query_repository(repository_id, prompt)
            doc, _ = ArchitectureDocument.objects.update_or_create(
                user=request.user,
                repository_id=repository_id,
                defaults={"content": content}
            )
            return Response({"content": doc.content, "updated_at": doc.updated_at})
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Failed to generate documentation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

