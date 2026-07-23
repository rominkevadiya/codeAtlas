from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AIQueryAnonThrottle(AnonRateThrottle):
    """Rate limit for anonymous users hitting the AI query endpoint."""
    scope = 'ai_query'


class AIQueryUserThrottle(UserRateThrottle):
    """Rate limit for authenticated users hitting the AI query endpoint."""
    scope = 'ai_query'
