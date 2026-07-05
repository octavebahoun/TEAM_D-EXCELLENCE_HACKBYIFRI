import requests
import json

LARAVEL_BASE_URL = "http://13.36.171.214:8000/api/v1"
ADMIN_EMAIL = "admin@academix.com"
ADMIN_PASSWORD = "password"

# Login
login_res = requests.post(
    f"{LARAVEL_BASE_URL}/auth/admin/login",
    json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    headers={"Accept": "application/json"}
)

print("Login status:", login_res.status_code)
if login_res.status_code == 200:
    token = login_res.json().get("token") or login_res.json().get("data", {}).get("token") or login_res.json().get("access_token")
    print("Token obtained:", token[:10] + "...")
    
    # Try GET /admin/notes/1
    notes_res = requests.get(
        f"{LARAVEL_BASE_URL}/admin/notes/1",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }
    )
    print("Notes GET status:", notes_res.status_code)
    try:
        print("Notes GET body:", json.dumps(notes_res.json(), indent=2))
    except:
        print("Notes GET text:", notes_res.text[:1000])
else:
    print("Login body:", login_res.text)
