"""
:synopsis: Parent crawler module, which supervises all crawlers.

Contains functions for initializing all subsidiary, threaded crawlers.
"""

import logging, logging.handlers, os, Queue

from bitshift.crawler import crawler, indexer

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

def _configure_logging():
    LOG_FILE_DIR = "log"

    if not os.path.exists(LOG_FILE_DIR):
        os.mkdir(LOG_FILE_DIR)

    logging.getLogger("requests").setLevel(logging.WARNING)

    formatter = logging.Formatter(
            fmt=("%(asctime)s %(levelname)s %(name)s %(funcName)s"
            " %(message)s"), datefmt="%y-%m-%d %H:%M:%S")

    handler = logging.handlers.TimedRotatingFileHandler(
            "%s/%s" % (LOG_FILE_DIR, "app.log"), when="H", interval=1,
            backupCount=20)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.NOTSET)
