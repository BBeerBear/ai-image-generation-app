# uvicorn main:app
# uvicorn main:app --reload

# Main Imports
from typing import Annotated, Union

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from functions.database import store_message

# Custom Functio Imports
from functions.open_ai_requests import (convert_audio_to_text,
                                        get_chat_reponse, reset_messages)
from functions.text_to_speech import convert_text_to_speech

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

# Reset Messages
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"message": "Conversation reset"}

# Get audio
@app.post("/post-audio-get/")
async def get_audio(file: Annotated[UploadFile, File(description="Your audio file")]):
    # Get saved audio
    # audio_input = open("voice.mp3","rb")

    # Save audio file from Frontend
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # Decode audio
    message_decoded = convert_audio_to_text(audio_input)

    # Guard: Ensure message decoded
    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")
    
    # Get ChatGPT Response
    chat_response = get_chat_reponse(message_decoded)

    # Guard: Ensure message decoded
    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to decode chat response")
    
    # Store messages
    store_message(message_decoded, chat_response)

    # Convert chat response to audio
    audio_output = convert_text_to_speech(chat_response)

    # Guard: Ensure message decoded
    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to get Eleven Labs audio response")
    
    # Create a generator that yields chunks of data
    def iterfile():
        yield audio_output

    # Return audio file
    return StreamingResponse(iterfile(), media_type="application/octet-stream")
