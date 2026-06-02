from fastapi import APIRouter

from app.schemas.responses import ToolInfo

router = APIRouter(prefix="/tools", tags=["tools"])

TOOLS: list[ToolInfo] = [
    ToolInfo(
        id="merge",
        name="Merge PDFs",
        description="Combine multiple PDF files into one document.",
        accepts_multiple_files=True,
    ),
    ToolInfo(
        id="split",
        name="Split PDF",
        description="Extract a page range from one PDF.",
        accepts_multiple_files=False,
        needs_page_selection=True,
    ),
    ToolInfo(
        id="remove-pages",
        name="Remove Pages",
        description="Delete selected pages from a PDF.",
        accepts_multiple_files=False,
        needs_page_selection=True,
    ),
    ToolInfo(
        id="reorder-pages",
        name="Reorder Pages",
        description="Arrange PDF pages in a new order.",
        accepts_multiple_files=False,
        needs_page_selection=True,
    ),
    ToolInfo(
        id="images-to-pdf",
        name="Images to PDF",
        description="Convert image files into a PDF document.",
        accepts_multiple_files=True,
    ),
    ToolInfo(
        id="encrypt",
        name="Encrypt PDF",
        description="Protect a PDF with a password.",
        accepts_multiple_files=False,
        needs_password=True,
    ),
    ToolInfo(
        id="decrypt",
        name="Decrypt PDF",
        description="Unlock a password-protected PDF.",
        accepts_multiple_files=False,
        needs_password=True,
    ),
    ToolInfo(
        id="compress",
        name="Compress PDF",
        description="Reduce PDF file size with lightweight optimization.",
        accepts_multiple_files=False,
    ),
    ToolInfo(
        id="rotate",
        name="Rotate Pages",
        description="Rotate selected pages in a PDF.",
        accepts_multiple_files=False,
        needs_page_selection=True,
    ),
]


@router.get("", response_model=list[ToolInfo])
def list_tools() -> list[ToolInfo]:
    return TOOLS
