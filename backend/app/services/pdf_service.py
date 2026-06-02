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
