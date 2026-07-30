from fastapi import FastAPI, UploadFile, File
from app.analyzer.code_analyzer import analyze_python_code
from app.analyzer.quality_analyzer import analyze_quality
from app.ai_model.codebert_analyzer import analyze_with_ai

import shutil
import os


app = FastAPI(
    title="AI Code Review Assistant"
)


UPLOAD_FOLDER = "app/uploads"


# Create upload folder if it does not exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



@app.get("/")
def home():

    return {
        "message": "AI Code Review Assistant Running"
    }



@app.post("/upload")
async def upload_code(
    file: UploadFile = File(...)
):

    # Save uploaded file

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"


    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # 1. Syntax Analysis

    syntax_review = analyze_python_code(
        file_path
    )


    # 2. Code Quality Analysis

    quality_review = analyze_quality(
        file_path
    )


    # 3. AI Code Review

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as code_file:

        code = code_file.read()



    ai_review = analyze_with_ai(
        code
    )


    return {

        "filename": file.filename,


        "syntax_review": syntax_review,


        "quality_review": quality_review,


        "ai_review": ai_review

    }