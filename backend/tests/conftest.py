import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.main import app
from app.core.db import get_db_session
from app.core.config import settings

@pytest.fixture(scope="function")
def db():
    engine = create_engine(settings.DATABASE_URL)
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db):
    app.dependency_overrides[get_db_session] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def mock_db_session(mocker):
    mock_session = mocker.Mock()
    return mock_session

@pytest.fixture
def mock_redis(mocker):
    mock_redis_client = mocker.Mock()
    return mock_redis_client