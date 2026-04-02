from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class BaseGatewayException(HTTPException):
    """
    Base generic exception for the API Gateway.
    All custom HTTP exceptions should inherit from this class.
    """
    def __init__(
        self, 
        status_code: int, 
        detail: Any = None, 
        headers: Optional[Dict[str, str]] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)

#errores 400 client side

class BadRequestError(BaseGatewayException):
    """Exception raised for malformed requests before proxying."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class AuthenticationError(BaseGatewayException):
    """Exception raised when JWT is missing, invalid, or expired."""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )

class AuthorizationError(BaseGatewayException):
    """Exception raised when the authenticated user lacks permissions (if applicable at Gateway level)."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class RouteNotFoundError(BaseGatewayException):
    """Exception raised when the requested path does not map to any downstream service."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class ConflictError(BaseGatewayException):
    """Exception raised when a resource already exists."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

class RateLimitExceededError(BaseGatewayException):
    """Exception raised when the client exceeds the allowed request quota."""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail=detail,
            headers={"Retry-After": "60"} # Recommended to update this dynamically later
        )

#errores 500 server side
class CompositionError(BaseGatewayException):
    """Exception raised when a downstream service returns an invalid response (Bad Gateway)."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)

class DownstreamServiceError(BaseGatewayException):
    """Exception raised when a downstream service returns an invalid response (Bad Gateway)."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)

class ServiceUnavailableError(BaseGatewayException):
    """Exception raised when a downstream service is down or refusing connections."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail)

class GatewayTimeoutError(BaseGatewayException):
    """Exception raised when httpx.AsyncClient times out waiting for a downstream service."""
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=detail)
