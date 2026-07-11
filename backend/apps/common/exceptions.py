class CodeAtlasException(Exception):
    """
    Base exception class for CodeAtlas.
    All custom exceptions should inherit from this class.
    """
    def __init__(self, message: str, error_code: str = "INTERNAL_ERROR", status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code

    def to_dict(self) -> dict:
        return {
            "error_code": self.error_code,
            "message": self.message,
            "status": self.status_code
        }
