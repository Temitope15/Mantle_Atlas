import time
from typing import Any

import requests

DEFAULT_TIMEOUT = 15
DEFAULT_RETRIES = 3
DEFAULT_BACKOFF_SECONDS = 1.0


class HTTPClient:
    timeout: int
    retries: int
    backoff_seconds: float
    session: requests.Session

    def __init__(
        self,
        timeout: int = DEFAULT_TIMEOUT,
        retries: int = DEFAULT_RETRIES,
        backoff_seconds: float = DEFAULT_BACKOFF_SECONDS,
        session: requests.Session | None = None,
    ) -> None:
        self.timeout = timeout
        self.retries = retries
        self.backoff_seconds = backoff_seconds
        self.session = session or requests.Session()

    def get(
        self,
        url: str,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        last_error: Exception | None = None

        for attempt in range(self.retries):
            try:
                response = self.session.get(
                    url,
                    params=params,
                    headers=headers,
                    timeout=self.timeout,
                )
                response.raise_for_status()
                return response.json()
            except requests.RequestException as exc:
                last_error = exc
                if attempt < self.retries - 1:
                    time.sleep(self.backoff_seconds * (attempt + 1))

        if last_error is not None:
            raise last_error

        raise RuntimeError("HTTP request failed")


http_client = HTTPClient()
