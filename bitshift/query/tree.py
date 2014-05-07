__all__ = ["Tree"]

class Tree(object):
    """Represents a query tree."""

    def __init__(self, root):
        self._root = root

    def __repr__(self):
        return "Tree({0})".format(self._root)

    def serialize(self):
        """Create a string representation of the query for caching.

        :return: Query string representation.
        :rtype: str
        """
        return repr(self)
