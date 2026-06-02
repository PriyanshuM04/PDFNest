from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import get_settings


def build_safe_filename(original_name: str, suffix: str | None = None) -> str:
    extension = suffix or Path(original_name).suffix.lower()
    return f"{uuid4().hex}{extension}"


async def save_upload(file: UploadFile) -> Path:
    settings = get_settings()
    filename = build_safe_filename(file.filename or "upload")
    destination = settings.uploads_dir / filename

    with destination.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            output.write(chunk)

    return destination


def create_output_path(extension: str = ".pdf") -> Path:
    settings = get_settings()
    return settings.outputs_dir / build_safe_filename("result", extension)
