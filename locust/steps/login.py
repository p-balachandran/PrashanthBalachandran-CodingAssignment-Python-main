import helper

def login(self, username, password):
 
    # Hit home (captures cookies/session)
    self.client.get("/", headers=helper.make_headers(self.user_id), name="GET /")
    # Login to establish session
    with self.client.post(
        "/login",
        data={"username": username, "password": password},
        headers=helper.make_headers(self.user_id),
        name="POST /login",
        allow_redirects=True,
        catch_response=True
    ) as resp:
        if resp.status_code not in (200, 302):
            resp.failure(f"Login failed: {resp.status_code}")
        else:
            resp.success()