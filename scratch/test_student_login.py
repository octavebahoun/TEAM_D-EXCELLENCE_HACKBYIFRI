import requests
import json

LARAVEL_BASE_URL = "http://13.36.171.214:8000/api/v1"
STUDENT_EMAIL = "etu-info-001@academix.com"
STUDENT_PASSWORD = "password"
STUDENT_MATRICULE = "ETU001"

login_res = requests.post(
    f"{LARAVEL_BASE_URL}/auth/student/login",
    json={
        "login": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD,
    },
    headers={"Accept": "application/json"}
)

print("Student Login status:", login_res.status_code)
print("Student Login response:", login_res.text)
