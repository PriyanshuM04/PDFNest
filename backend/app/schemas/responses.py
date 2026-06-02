from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str


class ToolInfo(BaseModel):
    id: str
    name: str
    description: str
    accepts_multiple_files: bool
    needs_page_selection: bool = False
    needs_password: bool = False


class ProcessResponse(BaseModel):
    success: bool
    file_id: str
    filename: str
    download_url: str
