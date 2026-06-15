import httpx
from conftest import BASE_URL

def test_health_check():
    response = httpx.get(f"{BASE_URL}/ping")
    assert response.status_code == 200

def test_no_url_fail():
    response = httpx.get(f"{BASE_URL}/api/notfound")
    assert response.status_code == 404

def test_no_auth_fail():
    response = httpx.get(f"{BASE_URL}/api/shopping")
    assert response.status_code == 401

