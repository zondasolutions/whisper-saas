# tests/test_users.py
import pytest
from uuid import uuid4

BASE_URL = "/api/v1/users"

@pytest.fixture
def user_payload():
    return {
        "name": "Pablo Test",
        "email": f"pablo_{uuid4().hex[:6]}@test.com",
        "password": "secret1234",
        "is_admin": False
    }

def test_create_user(client, user_payload):
    response = client.post(BASE_URL + "/", json=user_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_payload["email"]
    assert "password_hash" not in data

def test_create_user_duplicate_email(client, user_payload):
    client.post(BASE_URL + "/", json=user_payload)
    response = client.post(BASE_URL + "/", json=user_payload)
    assert response.status_code == 409

def test_get_all_users(client, user_payload):
    client.post(BASE_URL + "/", json=user_payload)
    response = client.get(BASE_URL + "/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_user_by_id(client, user_payload):
    created = client.post(BASE_URL + "/", json=user_payload).json()
    response = client.get(f"{BASE_URL}/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

def test_get_user_not_found(client):
    response = client.get(f"{BASE_URL}/{uuid4()}")
    assert response.status_code == 404

def test_update_user(client, user_payload):
    created = client.post(BASE_URL + "/", json=user_payload).json()
    response = client.patch(f"{BASE_URL}/{created['id']}", json={"name": "Actualizado"})
    assert response.status_code == 200
    assert response.json()["name"] == "Actualizado"

def test_delete_user(client, user_payload):
    created = client.post(BASE_URL + "/", json=user_payload).json()
    response = client.delete(f"{BASE_URL}/{created['id']}")
    assert response.status_code == 204

def test_delete_user_not_found(client):
    response = client.delete(f"{BASE_URL}/{uuid4()}")
    assert response.status_code == 404