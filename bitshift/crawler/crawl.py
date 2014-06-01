"""
:synopsis: Parent crawler module, which supervises all crawlers.

Contains functions for initializing all subsidiary, threaded crawlers.
"""

import logging, logging.handlers, os, Queue

from bitshift.crawler import crawler, indexer
from bitshift.parser import parse, start_parse_servers

__all__ = ["crawl"]

def crawl():
    """
    Initialize all crawlers (and indexers).

    Start the:
    1. GitHub crawler, :class:`crawler.GitHubCrawler`.
    2. Bitbucket crawler, :class:`crawler.BitbucketCrawler`.
    3. Git indexer, :class:`bitshift.crawler.indexer.GitIndexer`.
    """

    _configure_logging()

    MAX_URL_QUEUE_SIZE = 5e3

    repo_clone_queue = Queue.Queue(maxsize=MAX_URL_QUEUE_SIZE)
    threads = [crawler.GitHubCrawler(repo_clone_queue),
            crawler.BitbucketCrawler(repo_clone_queue),
            indexer.GitIndexer(repo_clone_queue)]

    for thread in threads:
        thread.start()

    parse_servers = start_parse_servers()

def _configure_logging():
    # This isn't ideal, since it means the bitshift python package must be kept
    # inside the app, but it works for now:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    log_dir = os.path.join(root, "logs")

    if not os.path.exists(log_dir):
        os.mkdir(log_dir)

    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)

    formatter = logging.Formatter(
            fmt=("%(asctime)s %(levelname)s %(name)s:%(funcName)s"
            " %(message)s"), datefmt="%y-%m-%d %H:%M:%S")

    handler = logging.handlers.TimedRotatingFileHandler(
            "%s/%s" % (log_dir, "app.log"), when="H", interval=1,
            backupCount=20)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.NOTSET)

if __name__ == "__main__":
    _configure_logging()
    crawl()
