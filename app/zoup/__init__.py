
from collections.abc import Sequence
from typing import Any
from bs4 import BeautifulSoup
from bs4.builder import TreeBuilder
from bs4.element import PageElement as PageElement, SoupStrainer as SoupStrainer

class Zoup(BeautifulSoup):
    
    def __init__(self, markup: str | bytes = "", features: str | Sequence[str] | None = None, builder: TreeBuilder | type[TreeBuilder] | None = None, parse_only: SoupStrainer | None = None, from_encoding: str | None = None, exclude_encodings: Sequence[str] | None = None, element_classes: dict[type[PageElement], type] | None = None, **kwargs) -> None:
        super().__init__(markup, features, builder, parse_only, from_encoding, exclude_encodings, element_classes, **kwargs)