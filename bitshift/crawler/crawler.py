"""
:synopsis: Main crawler module, to oversee all site-specific crawlers.

...more info soon...
"""

import requests, time

import git_indexer

from ..codelet import Codelet
from ..database import Database

def github():
    """
    Query the GitHub API for data about every public repository.

    Pull all of GitHub's repositories by making calls to its API in a loop,
    accessing a subsequent page of results via the "next" URL returned in an
    API response header. Uses Severyn Kozak's (sevko) authentication
    credentials.
    """

    next_api_url = "https://api.github.com/repositories"
    authentication_params = {
        "client_id" : "436cb884ae09be7f2a4e",
        "client_secret" : "8deeefbc2439409c5b7a092fd086772fe8b1f24e"
    }
    api_request_interval = 5e3 / 60 ** 2

    while len(next_api_url) > 0:
        start_time = time.time()
        response = requests.get(next_api_url, params=authentication_params)

        for repo in response.json():
            print repo["id"]

        if int(response.headers["x-ratelimit-remaining"]) == 0:
            time.sleep(int(response.headers["x-ratelimit-reset"]) - time.time())

        next_api_url = response.headers["link"].split(">")[0][1:]

        sleep_time = api_request_interval - (time.time() - start_time)
        if sleep_time > 0:
            time.sleep(sleep_time)
