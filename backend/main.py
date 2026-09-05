from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends
)


from sqlalchemy.orm import Session


from app.ai_model.codebert_analyzer import analyze_with_ai

from app.analyzer.code_analyzer import analyze_python_code

from app.analyzer.quality_analyzer import analyze_quality


from app.database import (
    get_db,
    engine
)


from app.models import (
    Base,
    Review
)


import shutil
import os
import json





# -------------------------------------------------
# Database Initialization
# -------------------------------------------------

Base.metadata.create_all(
    bind=engine
)





# -------------------------------------------------
# FastAPI App
# -------------------------------------------------

app = FastAPI(

    title="AI Code Review Assistant",

    description=
    "AI powered code analysis platform using CodeBERT"

)






# -------------------------------------------------
# Upload Directory
# -------------------------------------------------

UPLOAD_FOLDER = "app/uploads"



os.makedirs(

    UPLOAD_FOLDER,

    exist_ok=True

)







# -------------------------------------------------
# Home Route
# -------------------------------------------------

@app.get("/")
def home():


    return {


        "message":
        "AI Code Review Assistant Running"


    }









# -------------------------------------------------
# Upload + Analyze + Save Review
# -------------------------------------------------

@app.post("/upload")
async def upload_code(

    file: UploadFile = File(...),

    db: Session = Depends(get_db)

):


    # Save uploaded file

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






    # Read source code

    with open(

        file_path,

        "r",

        encoding="utf-8"

    ) as f:


        code = f.read()







    # Static Analysis

    syntax_review = (

        analyze_python_code(

            file_path

        )

    )






    # Code Quality Analysis

    quality_review = (

        analyze_quality(

            file_path

        )

    )







    # CodeBERT AI Analysis

    ai_review = (

        analyze_with_ai(

            code

        )

    )







    issues = (

        ai_review.get(

            "suggestions",

            []

        )

    )





    quality_score = (

        ai_review.get(

            "quality_score",

            0

        )

    )







    # ---------------------------------------------
    # Save Review To Render PostgreSQL
    # ---------------------------------------------


    review = Review(


        filename=file.filename,


        code=code,


        quality_score=quality_score,


        analysis=json.dumps(

            issues

        )


    )



    db.add(review)


    db.commit()


    db.refresh(review)









    # Response to React

    return {


        "id":

        review.id,



        "filename":

        file.filename,



        "analysis":

        issues,



        "quality_score":

        quality_score,



        "syntax_review":

        syntax_review,



        "quality_review":

        quality_review,



        "ai_model":

        ai_review.get(

            "model",

            "CodeBERT"

        )



    }









# -------------------------------------------------
# Review History API
# -------------------------------------------------

@app.get("/reviews")
def get_reviews(

    db: Session = Depends(get_db)

):


    reviews = (

        db.query(

            Review

        )

        .order_by(

            Review.created_at.desc()

        )

        .all()

    )




    return reviews