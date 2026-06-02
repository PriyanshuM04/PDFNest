from pathlib import Path

from fastapi import HTTPException, UploadFile, status

PDF_CONTENT_TYPES = {"application/pdf"}
IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_pdf(file: UploadFile) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix != ".pdf" or file.content_type not in PDF_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported for this tool.",
        )


def validate_image(file: UploadFile) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp"} or file.content_type not in IMAGE_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and WebP images are supported.",
        )
