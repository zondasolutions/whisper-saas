import os
import sys
import pytest
from fastapi.testclient import TestClient
# Assuming the user will create the FastAPI app in app.main
# We mock it or import it if exists
# For TDD, they might not have it yet, so we try to import, if it fails, the tests will fail until they write it.

# Make sure `iam` package is on sys.path for pytest from repository root
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.main import app

@pytest.fixture
def client():
    # TestClient to make requests to the FastAPI app
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def mock_db_session(mocker):
    # Mocking the database dependency for unit tests
    mock_session = mocker.Mock()
    return mock_session

@pytest.fixture
def mock_redis(mocker):
    # Mocking Redis for OTP logic
    mock_redis_client = mocker.Mock()
    return mock_redis_client
