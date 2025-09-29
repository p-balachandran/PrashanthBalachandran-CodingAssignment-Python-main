# locust/scenarios/login.py
from locust import task, tag, HttpUser
from steps.login import login as do_login
import csv, random
import uuid


with open("test-data/logins.csv", newline="", encoding="utf-8") as f:
    CREDS = list(csv.DictReader(f))
if not CREDS or not {"username", "password"}.issubset(CREDS[0].keys()):
    raise RuntimeError("CSV must have headers: username,password")
    

class Login(HttpUser):
    def on_start(self):
        # Assign a stable ID for this simulated user
        self.user_id = f"user-{uuid.uuid4().hex[:8]}"

    @task(1)
    @tag("login")
    def login_task(self):
        cred = random.choice(CREDS)
        do_login(self, cred["username"], cred["password"])
