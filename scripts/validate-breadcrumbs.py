#!/usr/bin/env python3
"""Validate every Schema.org BreadcrumbList embedded in published HTML pages."""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATTERN = re.compile(
    r'<script\b[^>]*\btype\s*=\s*["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)


@dataclass
class Result:
    lists: int = 0
    items: int = 0
    missing_names: int = 0
    errors: list[str] | None = None

    def __post_init__(self) -> None:
        if self.errors is None:
            self.errors = []


def breadcrumb_lists(value: object) -> list[dict[str, object]]:
    found: list[dict[str, object]] = []
    if isinstance(value, dict):
        schema_type = value.get('@type')
        if schema_type == 'BreadcrumbList' or (
            isinstance(schema_type, list) and 'BreadcrumbList' in schema_type
        ):
            found.append(value)
        for child in value.values():
            found.extend(breadcrumb_lists(child))
    elif isinstance(value, list):
        for child in value:
            found.extend(breadcrumb_lists(child))
    return found


def item_name(item: dict[str, object]) -> str:
    name = item.get('name')
    if isinstance(name, str) and name.strip():
        return name.strip()
    linked_item = item.get('item')
    if isinstance(linked_item, dict):
        linked_name = linked_item.get('name')
        if isinstance(linked_name, str) and linked_name.strip():
            return linked_name.strip()
    return ''


def item_url(item: dict[str, object]) -> str:
    value = item.get('item')
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        identifier = value.get('@id') or value.get('url')
        return identifier.strip() if isinstance(identifier, str) else ''
    return ''


def validate_url(path: Path, position: int, url: str, result: Result) -> None:
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.netloc != 'medomicile.com':
        result.errors.append(f'{path.name}: breadcrumb item {position} has a non-canonical URL {url!r}')
        return
    if parsed.path.endswith('/index.html'):
        result.errors.append(f'{path.name}: breadcrumb item {position} points to /index.html')
    if parsed.path not in ('', '/') and not (ROOT / parsed.path.lstrip('/')).is_file():
        result.errors.append(f'{path.name}: breadcrumb item {position} points to a missing page {url!r}')


def validate_file(path: Path, result: Result) -> None:
    html = path.read_text(encoding='utf-8')
    lists_in_file = 0
    for index, match in enumerate(SCRIPT_PATTERN.finditer(html), start=1):
        try:
            payload = json.loads(match.group(1).strip())
        except json.JSONDecodeError as error:
            result.errors.append(f'{path.name}: invalid JSON-LD script #{index}: {error.msg}')
            continue

        for breadcrumb in breadcrumb_lists(payload):
            lists_in_file += 1
            result.lists += 1
            elements = breadcrumb.get('itemListElement')
            if not isinstance(elements, list) or not elements:
                result.errors.append(f'{path.name}: BreadcrumbList has no itemListElement array')
                continue
            for position, item in enumerate(elements, start=1):
                result.items += 1
                if not isinstance(item, dict):
                    result.errors.append(f'{path.name}: breadcrumb item {position} is not an object')
                    continue
                if item.get('@type') != 'ListItem':
                    result.errors.append(f'{path.name}: breadcrumb item {position} has no ListItem type')
                if item.get('position') != position:
                    result.errors.append(
                        f'{path.name}: breadcrumb item {position} has position {item.get("position")!r}'
                    )
                if not item_name(item):
                    result.missing_names += 1
                    result.errors.append(f'{path.name}: breadcrumb item {position} has no name')
                url = item_url(item)
                if position < len(elements) and not url:
                    result.errors.append(f'{path.name}: breadcrumb item {position} has no item URL')
                elif url:
                    validate_url(path, position, url, result)
    if lists_in_file > 1:
        result.errors.append(f'{path.name}: contains {lists_in_file} BreadcrumbList objects')


def main() -> int:
    result = Result()
    for path in sorted(ROOT.glob('*.html')):
        validate_file(path, result)

    print(f'BreadcrumbList audited: {result.lists}')
    print(f'ListItems audited: {result.items}')
    print(f'Items without name: {result.missing_names}')
    if result.errors:
        print('Errors:')
        print('\n'.join(f'- {error}' for error in result.errors))
        return 1
    print('Breadcrumb validation passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
