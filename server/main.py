import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

load_dotenv()

REMOVE_BG_API_KEY = os.getenv("REMOVE_BG_API_KEY")
REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg"
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024

http_client: httpx.AsyncClient


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    global http_client
    http_client = httpx.AsyncClient(timeout=60.0)
    yield
    await http_client.aclose()


app = FastAPI(title="Shaked Background Removal API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/api/remove-background")
async def remove_background(image: UploadFile = File(...)) -> StreamingResponse:
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed formats: PNG, JPG, JPEG, WebP.",
        )

    file_bytes = await image.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10 MB.",
        )

    if not REMOVE_BG_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error. API key is not set.",
        )

    response = await http_client.post(
        REMOVE_BG_URL,
        headers={"X-Api-Key": REMOVE_BG_API_KEY},
        files={"image_file": (image.filename, file_bytes, image.content_type)},
        data={"size": "auto"},
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Background removal service failed. Please try again later.",
        )

    return StreamingResponse(
        content=iter([response.content]),
        media_type="image/png",
        headers={
            "Content-Disposition": f'attachment; filename="no-bg-{image.filename}"'
        },
    )
