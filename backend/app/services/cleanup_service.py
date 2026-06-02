from datetime import datetime, timedelta, timezone
from pathlib import Path

from app.core.config import get_settings


def cleanup_expired_files() -> int:
    settings = get_settings()
    expiry_time = datetime.now(timezone.utc) - timedelta(minutes=settings.file_expiry_minutes)
    deleted_count = 0

    for directory in (settings.uploads_dir, settings.outputs_dir):
        for file_path in directory.glob("*"):
            if not file_path.is_file() or file_path.name == ".gitkeep":
                continue

            modified_at = datetime.fromtimestamp(file_path.stat().st_mtime, tz=timezone.utc)
            if modified_at < expiry_time:
                file_path.unlink(missing_ok=True)
                deleted_count += 1

    return deleted_count
