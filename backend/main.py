from fastapi import (
    FastAPI,
    UploadFile,
    File
)

from app.ai_model.codebert_analyzer import analyze_with_ai

from app.analyzer.code_analyzer import analyze_python_code

from app.analyzer.quality_analyzer import analyze_quality


import shutil
import os





app = FastAPI(

    title=
    "AI Code Review Assistant"

)





UPLOAD_FOLDER = "app/uploads"



os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)






@app.get("/")
def home():


    return {

        "message":
        "AI Code Review Assistant Running"

    }









@app.post("/upload")
async def upload_code(

    file:UploadFile = File(...)

):



    file_path = (

        f"{UPLOAD_FOLDER}/{file.filename}"

    )




    with open(
        file_path,
        "wb"
    ) as buffer:


        shutil.copyfileobj(

            file.file,

            buffer

        )





    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as f:


        code = f.read()






    syntax_review = (

        analyze_python_code(

            file_path

        )

    )






    quality_review = (

        analyze_quality(

            file_path

        )

    )






    ai_review = (

        analyze_with_ai(

            code

        )

    )







    return {


        "filename":
        file.filename,



        "analysis":

        ai_review["suggestions"],




        "quality_score":

        ai_review["quality_score"],




        "syntax_review":

        syntax_review,




        "quality_review":

        quality_review,




        "ai_model":

        ai_review["model"]

    }