__all__ = ["Codelet"]

class Codelet(object):
    """
    A source-code object with code metadata and composition analysis.

    :ivar name: (str) A suitable name for the codelet.
    :ivar code: (str) A containing the raw source code.
    :ivar filename: (str, or None) The filename of the snippet.
    :ivar language: (int, or None) The inferred language of `code`.
    :ivar authors: (array of tuples (str, str or None)) An array of tuples
        containing an author's name and profile URL (on the service the code
        was pulled from).
    :ivar code_url: (str) The url of the (page containing the) source code.
    :ivar date_created: (:class:`datetime.datetime`, or None) The date the code
        was published.
    :ivar date_modified: (:class:`datetime.datetime`, or None) The date the
        code was last modified.
    :ivar rank: (float) A quanitification of the source code's quality, as
        per available ratings (stars, forks, upvotes, etc.).
    :ivar symbols: (dict) Dictionary containing dictionaries of functions, classes,
        variable definitions, etc.
    """

    def __init__(self, name, code, filename, language, authors, code_url,
            date_created, date_modified, rank):
        """
        Create a Codelet instance.

        :param name: see :attr:`self.name`
        :param code: see :attr:`self.code`
        :param filename: see :attr:`self.filename`
        :param language: see :attr:`self.language`
        :param authors: see :attr:`self.authors`
        :param code_url: see :attr:`self.code_url`
        :param date_created: see :attr:`self.date_created`
        :param date_modified: see :attr:`self.date_modified`
        :param rank: see :attr:`self.rank`

        :type name: see :attr:`self.name`
        :type code: see :attr:`self.code`
        :type filename: see :attr:`self.filename`
        :type language: see :attr:`self.language`
        :type authors: see :attr:`self.authors`
        :type code_url: see :attr:`self.code_url`
        :type date_created: see :attr:`self.date_created`
        :type date_modified: see :attr:`self.date_modified`
        :type rank: see :attr:`self.rank`
        """

        self.name = name
        self.code = code
        self.filename = filename
        self.language = language
        self.authors = authors
        self.code_url = code_url
        self.date_created = date_created
        self.date_modified = date_modified
        self.rank = rank
