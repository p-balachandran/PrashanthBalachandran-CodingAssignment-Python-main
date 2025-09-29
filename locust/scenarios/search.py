# locust/scenarios/login.py
from locust import task, tag, HttpUser
from steps.login import login as do_login
from steps.search import search as do_search
from helper import load_cities, pick_route
from pathlib import Path
import csv, random, uuid

## TO DO: add to helper
with open("test-data/logins.csv", newline="", encoding="utf-8") as f:
    CREDS = list(csv.DictReader(f))
if not CREDS or not {"username", "password"}.issubset(CREDS[0].keys()):
    raise RuntimeError("CSV must hav headers: username,password")

# Absolute path to cities file (works no matter where you run Locust from)
DATA_PATH = Path(__file__).resolve().parents[1] / "test-data" / "cities.txt"
CITIES = load_cities(DATA_PATH)

class Search(HttpUser):

    def on_start(self):
        # Assign a stable ID for this simulated user
        self.user_id = f"user-{uuid.uuid4().hex[:8]}"

        cred = random.choice(CREDS)
        do_login(self, cred["username"], cred["password"])

    @task(1)
    @tag("search")
    def search_task(self):
        from_city, to_city = pick_route(CITIES)
        do_search(self, from_city, to_city)