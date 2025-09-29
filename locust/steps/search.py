import helper

def search(self, from_place, to_place):
    self.client.get("/api/search?from={}&to={}".format(from_place, to_place),
        headers=helper.make_headers(self.user_id),
        name="GET /api/search"
    )