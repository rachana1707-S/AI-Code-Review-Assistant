from fastapi import FastAPI, UploadFile, File
from app.analyzer.code_analyzer import analyze_python_code
from app.analyzer.quality_analyzer import analyze_quality
import shutil
import os


app = FastAPI(
    title="AI Code Review Assistant"
)


UPLOAD_FOLDER="app/uploads"


@app.get("/")
def home():

    return {
        "message":"AI Code Review Assistant Running"
    }


@app.post("/upload")
async def upload_code(
    file: UploadFile = File(...)
):

    file_path=f"{UPLOAD_FOLDER}/{file.filename}"


    with open(file_path,"wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    syntax_review = analyze_python_code(file_path)

    quality_review = analyze_quality(file_path)


    return {

        "filename": file.filename,

        "syntax_review": syntax_review,

        "quality_review": quality_review

    }