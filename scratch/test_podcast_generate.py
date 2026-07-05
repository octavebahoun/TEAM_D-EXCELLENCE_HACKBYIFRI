import requests
import io

LARAVEL_BASE_URL = "http://13.36.171.214:8000/api/v1"
PYTHON_BASE_URL = "http://13.36.171.214:5000/api/v1"
STUDENT_EMAIL = "etu-info-001@academix.com"
STUDENT_PASSWORD = "password"

# 1. Login
print("Logging in...")
login_res = requests.post(
    f"{LARAVEL_BASE_URL}/auth/student/login",
    json={
        "login": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD,
    },
    headers={"Accept": "application/json"}
)

if login_res.status_code != 200:
    print("Login failed:", login_res.text)
    exit(1)

token = login_res.json()["token"]
print("Login successful! Token:", token)

# 2. Test Podcast Generation
print("\nGenerating podcast...")
content = """
Introduction aux réseaux informatiques.
Un réseau est un ensemble d'équipements reliés entre eux pour échanger des informations.
Les protocoles TCP/IP sont la base d'Internet.
Le modèle OSI comporte 7 couches.
Les adresses IP identifient les machines sur le réseau.
"""
fake_file = io.BytesIO(content.encode("utf-8"))

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

r = requests.post(
    f"{PYTHON_BASE_URL}/podcast/generate",
    files={"file": ("reseaux.txt", fake_file, "text/plain")},
    headers=headers,
    timeout=120
)

print("Status code:", r.status_code)
print("Response text:", r.text)
