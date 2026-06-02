from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import FileResponse

from app.schemas.responses import ProcessResponse
from app.services.storage_service import save_upload, create_output_path
from app.utils.file_validation import validate_pdf
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
        raise HTTPException(status_code=500, detail=f"Merge failed: {exc}")

    download_url = f"{settings.api_prefix}/process/download/{out_path.name}"

    return ProcessResponse(success=True, file_id=out_path.name, filename=out_path.name, download_url=download_url)


@router.get("/download/{file_id}")
def download_result(file_id: str):
    settings = get_settings()
    file_path = settings.outputs_dir / file_id
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(path=file_path, filename=file_path.name, media_type="application/pdf")
