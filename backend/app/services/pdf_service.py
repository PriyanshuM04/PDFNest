from pathlib import Path
from typing import Iterable

from pypdf import PdfMerger


def merge_pdfs(input_paths: Iterable[Path], output_path: Path) -> None:
    merger = PdfMerger()

    for p in input_paths:
        merger.append(str(p))

    # write to a temporary file then move/rename to final path to avoid partial writes
    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        merger.write(f)
    tmp.replace(output_path)


def split_pdf(input_path: Path, output_path: Path, start_page: int, end_page: int) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    writer = PdfWriter()

    total = len(reader.pages)
    # convert to 0-based indices
    s = max(0, start_page - 1)
    e = min(total - 1, end_page - 1)

    if s > e or s < 0 or e >= total:
        raise ValueError("Invalid page range")

    for i in range(s, e + 1):
        writer.add_page(reader.pages[i])

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)


def remove_pages(input_path: Path, output_path: Path, pages_to_remove: set[int]) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    writer = PdfWriter()

    total = len(reader.pages)
    # pages_to_remove contains 1-based indices
    normalized = {p - 1 for p in pages_to_remove if 1 <= p <= total}

    for idx in range(total):
        if idx in normalized:
            continue
        writer.add_page(reader.pages[idx])

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)


def reorder_pages(input_path: Path, output_path: Path, new_order: list[int]) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    writer = PdfWriter()

    total = len(reader.pages)
    # new_order is 1-based indices
    indices = [i - 1 for i in new_order]
    if sorted(indices) != list(range(total)):
        raise ValueError("New order must be a permutation of all pages")

    for idx in indices:
        writer.add_page(reader.pages[idx])

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)
