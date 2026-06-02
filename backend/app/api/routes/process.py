from fastapi import APIRouter, File, UploadFile, HTTPException, status
import logging
import traceback
from fastapi.responses import FileResponse

from app.schemas.responses import ProcessResponse
from app.services.storage_service import save_upload, create_output_path
from app.utils.file_validation import validate_pdf, validate_image
from app.services.pdf_service import merge_pdfs
from app.core.config import get_settings

router = APIRouter(prefix="/process", tags=["process"])


@router.post("/merge", response_model=ProcessResponse)
async def process_merge(files: list[UploadFile] = File(...)) -> ProcessResponse:
    if not files or len(files) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one PDF is required.")

    settings = get_settings()

    # validate and save uploads
    saved_paths = []
    for f in files:
        validate_pdf(f)
        path = await save_upload(f)
        saved_paths.append(path)

    out_path = create_output_path(".pdf")

    try:
        merge_pdfs(saved_paths, out_path)
    except Exception as exc:
        logging.getLogger(__name__).exception("Merge failed")
        # include limited info in response, full traceback is in server logs
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Merge failed on server. See server logs. Error: {str(exc)}\n{tb}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"

    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.get("/download/{file_id}")
def download_result(file_id: str):
    settings = get_settings()
    file_path = settings.outputs_dir / file_id
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(path=file_path, filename=file_path.name, media_type="application/pdf")



@router.post("/split", response_model=ProcessResponse)
async def process_split(file: UploadFile = File(...), page_range: str | None = None) -> ProcessResponse:
    validate_pdf(file)
    if not page_range:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="page_range is required (e.g. 1-3)")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        parts = page_range.split("-")
        start = int(parts[0])
        end = int(parts[1]) if len(parts) > 1 else start
        from app.services.pdf_service import split_pdf

        split_pdf(saved, out_path, start, end)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Split failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/images-to-pdf", response_model=ProcessResponse)
async def process_images_to_pdf(files: list[UploadFile] = File(...)) -> ProcessResponse:
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one image is required.")

    settings = get_settings()
    saved_paths = []
    for f in files:
        validate_image(f)
        p = await save_upload(f)
        saved_paths.append(p)

    out_path = create_output_path(".pdf")
    try:
        from app.services.pdf_service import images_to_pdf

        images_to_pdf(saved_paths, out_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Images to PDF failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/encrypt", response_model=ProcessResponse)
async def process_encrypt(file: UploadFile = File(...), password: str | None = None) -> ProcessResponse:
    validate_pdf(file)
    if not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="password is required")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        from app.services.pdf_service import encrypt_pdf

        encrypt_pdf(saved, out_path, password)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Encrypt failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/decrypt", response_model=ProcessResponse)
async def process_decrypt(file: UploadFile = File(...), password: str | None = None) -> ProcessResponse:
    validate_pdf(file)
    if not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="password is required")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        from app.services.pdf_service import decrypt_pdf

        decrypt_pdf(saved, out_path, password)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Decrypt failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/compress", response_model=ProcessResponse)
async def process_compress(file: UploadFile = File(...)) -> ProcessResponse:
    validate_pdf(file)
    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        from app.services.pdf_service import compress_pdf

        compress_pdf(saved, out_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Compress failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/rotate", response_model=ProcessResponse)
async def process_rotate(file: UploadFile = File(...), pages: str | None = None, degrees: int = 90) -> ProcessResponse:
    validate_pdf(file)
    if not pages:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="pages is required (e.g. 1,3)")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        page_set = {int(p.strip()) for p in pages.split(",") if p.strip()}
        from app.services.pdf_service import rotate_pages

        rotate_pages(saved, out_path, page_set, degrees)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Rotate failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/remove-pages", response_model=ProcessResponse)
async def process_remove_pages(file: UploadFile = File(...), pages: str | None = None) -> ProcessResponse:
    validate_pdf(file)
    if not pages:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="pages is required (e.g. 2,4,5)")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        page_set = {int(p.strip()) for p in pages.split(",") if p.strip()}
        from app.services.pdf_service import remove_pages

        remove_pages(saved, out_path, page_set)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Remove pages failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.post("/reorder", response_model=ProcessResponse)
async def process_reorder(file: UploadFile = File(...), order: str | None = None) -> ProcessResponse:
    validate_pdf(file)
    if not order:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="order is required (e.g. 3,1,2)")

    settings = get_settings()
    saved = await save_upload(file)
    out_path = create_output_path(".pdf")

    try:
        new_order = [int(p.strip()) for p in order.split(",") if p.strip()]
        from app.services.pdf_service import reorder_pages

        reorder_pages(saved, out_path, new_order)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Reorder failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"
    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)
