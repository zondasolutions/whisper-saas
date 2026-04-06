# tests/test_plans.py
import pytest
from uuid import uuid4

BASE_URL = "/api/v1/plans"

@pytest.fixture
def plan_payload():
    return {
        "name": "Plan Pro",
        "mercadopago_plan_id": f"mp_plan_{uuid4().hex[:8]}",
        "price": 9999.99,
        "frequency": 1,
        "frequency_type": "months"
    }

def test_create_plan(client, plan_payload):
    response = client.post(BASE_URL + "/", json=plan_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == plan_payload["name"]
    assert data["mercadopago_plan_id"] == plan_payload["mercadopago_plan_id"]

def test_create_plan_duplicate_mp_id(client, plan_payload):
    client.post(BASE_URL + "/", json=plan_payload)
    response = client.post(BASE_URL + "/", json=plan_payload)
    assert response.status_code == 409

def test_get_all_plans(client, plan_payload):
    client.post(BASE_URL + "/", json=plan_payload)
    response = client.get(BASE_URL + "/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_plan_by_id(client, plan_payload):
    created = client.post(BASE_URL + "/", json=plan_payload).json()
    response = client.get(f"{BASE_URL}/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

def test_get_plan_not_found(client):
    response = client.get(f"{BASE_URL}/{uuid4()}")
    assert response.status_code == 404

def test_update_plan(client, plan_payload):
    created = client.post(BASE_URL + "/", json=plan_payload).json()
    response = client.patch(f"{BASE_URL}/{created['id']}", json={"price": 4999.99})
    assert response.status_code == 200
    assert float(response.json()["price"]) == 4999.99

def test_delete_plan(client, plan_payload):
    created = client.post(BASE_URL + "/", json=plan_payload).json()
    response = client.delete(f"{BASE_URL}/{created['id']}")
    assert response.status_code == 204

# tests/test_plans.py - agregar al final

DETAIL_PAYLOAD = {
    "max_minutes_per_month": 300,
    "max_file_size_mb": 100,
    "max_files_per_month": 50,
    "allowed_formats": ["mp3", "wav", "mp4"],
    "transcription_languages": ["es", "en"],
    "features": {
        "export_txt": True,
        "export_pdf": True,
        "export_srt": False,
        "speaker_detection": False,
        "priority_queue": False,
        "api_access": False
    }
}

def test_update_plan_details(client, plan_payload):
    created = client.post(BASE_URL + "/", json=plan_payload).json()
    response = client.patch(f"{BASE_URL}/{created['id']}/details", json=DETAIL_PAYLOAD)
    assert response.status_code == 200
    details = response.json()["plan_details"]
    assert details["max_minutes_per_month"] == 300
    assert details["features"]["export_pdf"] is True

def test_update_plan_details_not_found(client):
    response = client.patch(f"{BASE_URL}/{uuid4()}/details", json=DETAIL_PAYLOAD)
    assert response.status_code == 404