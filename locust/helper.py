import random
from pathlib import Path

#make_headers: updates header so that active user count it increased for every user in locust
def make_headers(user_id):
    return {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": f"locust-user-{user_id}"
    }

def load_cities(path) -> list[str]:
    """
    Load a list of city names (one per line) from a file.
    Blank lines and comments (# ...) are ignored.
    Returns a list of strings.
    """
    p = Path(path).expanduser().resolve()
    with p.open(encoding="utf-8") as f:
        cities = [line.strip() for line in f if line.strip() and not line.lstrip().startswith("#")]
    if len(cities) < 2:
        raise RuntimeError(f"Need at least 2 cities in {p}")
    return cities

def pick_route(cities: list[str]) -> tuple[str, str]:
    """
    Pick two distinct cities: (from_city, to_city).
    """
    a, b = random.sample(cities, 2)  # guarantees distinct
    return a, b