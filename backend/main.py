from fastapi import FastAPI, UploadFile, File
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


    return {

        "filename":file.filename,
        "status":"uploaded"

    }