from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PDFNest API"
    api_prefix: str = "/api"
    frontend_origin: str = "http://localhost:5173"
    max_upload_mb: int = 50
    file_expiry_minutes: int = 60

    backend_root: Path = Path(__file__).resolve().parents[2]
    storage_dir: Path = backend_root / "storage"
    uploads_dir: Path = storage_dir / "uploads"
    outputs_dir: Path = storage_dir / "outputs"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    settings.outputs_dir.mkdir(parents=True, exist_ok=True)
    return settings


