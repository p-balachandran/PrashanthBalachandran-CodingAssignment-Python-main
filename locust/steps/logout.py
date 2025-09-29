import helper

def logout(self):
    with self.client.get(
        "/logout",
        name="POST /logout",
        headers=helper.make_headers(self.user_id),
        allow_redirects=True,
        catch_response=True
    ) as resp:
        if resp.status_code not in (200, 302):
            resp.failure(f"Logout failed: {resp.status_code}")
        else:
            resp.success()