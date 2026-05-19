"""Rafla — arka plan kaldırma servisi (rembg)."""

from io import BytesIO

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from rembg import remove
from PIL import Image

app = FastAPI(title="Rafla Rembg Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    raw = await file.read()
    input_image = Image.open(BytesIO(raw)).convert("RGBA")
    output_image = remove(input_image)
    buf = BytesIO()
    output_image.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")
