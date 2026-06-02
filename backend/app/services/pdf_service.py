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


def images_to_pdf(input_paths: Iterable[Path], output_path: Path) -> None:
    from PIL import Image

    images = []
    for p in input_paths:
        img = Image.open(p)
        # Convert to RGB for PDF
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img = bg
        else:
            img = img.convert("RGB")
        images.append(img)

    if not images:
        raise ValueError("No images provided")

    first, rest = images[0], images[1:]
    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    first.save(tmp, format="PDF", save_all=True, append_images=rest)
    tmp.replace(output_path)


def encrypt_pdf(input_path: Path, output_path: Path, password: str) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    writer = PdfWriter()
    for p in reader.pages:
        writer.add_page(p)

    writer.encrypt(user_pwd=password, owner_pwd=None, use_128bit=True)

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)


def decrypt_pdf(input_path: Path, output_path: Path, password: str) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    if reader.is_encrypted:
        # try to decrypt
        ok = reader.decrypt(password)
        if not ok:
            raise ValueError("Incorrect password")

    writer = PdfWriter()
    for p in reader.pages:
        writer.add_page(p)

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)


def compress_pdf(input_path: Path, output_path: Path) -> None:
    # Use PyMuPDF to perform a lightweight recompression/cleanup
    import fitz

    doc = fitz.open(str(input_path))
    # garbage=3 removes unused objects, deflate=True compresses streams
    doc.save(str(output_path.with_suffix(output_path.suffix + ".tmp")), garbage=3, deflate=True)
    doc.close()
    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    tmp.replace(output_path)


def rotate_pages(input_path: Path, output_path: Path, pages: set[int], degrees: int) -> None:
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(input_path))
    writer = PdfWriter()

    total = len(reader.pages)
    normalized = {p - 1 for p in pages if 1 <= p <= total}

    for idx in range(total):
        page = reader.pages[idx]
        if idx in normalized:
            # rotate_clockwise expects degrees multiple of 90
            if degrees % 90 != 0:
                raise ValueError("Degrees must be a multiple of 90")
            # pypdf provides rotate_clockwise
            page.rotate_clockwise(degrees)
        writer.add_page(page)

    tmp = output_path.with_suffix(output_path.suffix + ".tmp")
    with tmp.open("wb") as f:
        writer.write(f)
    tmp.replace(output_path)
