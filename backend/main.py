# uvicorn main:app
# uvicorn main:app --reload
import os
from typing import Annotated, Union

import openai
from decouple import config
from fastapi import (Cookie, FastAPI, File, Form, HTTPException, Path, Query,
                     UploadFile)
from fastapi.middleware.cors import CORSMiddleware

# Initiate App
app = FastAPI()

# CPRS - Origins
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# openai.organization = "YOUR_ORG_ID"
# openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.Model.list()

@app.get("/health")
async def check_health():
    return {"message": "Hello World"}

# @app.post("/post-audio")
# async def post_audio(file: UploadFile):
#     print("hello")


@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: Annotated[UploadFile, File(description='Your upload voice file')]):
    return {"filename": file.filename}