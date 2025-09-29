# locust/scenarios/login.py
from locust import task, tag, HttpUser
from steps.logout import logout as do_logout
from steps.login import login as do_login
import csv, random, uuid

## TO DO: add to helper
with open("test-data/logins.csv", newline="", encoding="utf-8") as f:
    CREDS = list(csv.DictReader(f))
if not CREDS or not {"username", "password"}.issubset(CREDS[0].keys()):
    raise RuntimeError("CSV must hav headers: username,password")

class Logout(HttpUser):
    def on_start(self):
        # Assign a stable ID for this simulated user
        self.user_id = f"user-{uuid.uuid4().hex[:8]}"

    @task(1)
    @tag("logout")
    def logout_task(self):
        cred = random.choice(CREDS)
        do_login(self, cred["username"], cred["password"])
        do_logout(self)
