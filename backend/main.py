from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.ai_model.codebert_analyzer import analyze_with_ai
from app.analyzer.code_analyzer import analyze_python_code
from app.analyzer.quality_analyzer import analyze_quality
from app.analyzer.scoring import calculate_quality_score
from app.analyzer.normalizer import normalize_issues
from app.database import get_db, engine
from app.models import Base, Review
from app.auth.routes import router as auth_router

import shutil
import os
import json


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Code Review Assistant",
    description="AI powered code analysis platform using CodeBERT"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth_router)


UPLOAD_FOLDER = "app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "AI Code Review Assistant Running"
    }


@app.post("/upload")
async def upload_code(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    syntax_review = analyze_python_code(file_path)

    quality_review = analyze_quality(file_path)

    ai_review = analyze_with_ai(code)

    ai_issues = ai_review.get(
        "suggestions",
        []
    )

    pylint_issues = quality_review.get(
        "pylint_issues",
        []
    )

    flake8_issues = quality_review.get(
        "flake8_issues",
        []
    )

    all_issues = (
        ai_issues
        + pylint_issues
        + flake8_issues
    )

    issues = normalize_issues(
        all_issues
    )

    quality_score = calculate_quality_score(
        issues
    )

    review = Review(
        filename=file.filename,
        code=code,
        quality_score=quality_score,
        analysis=json.dumps(issues)
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "id": review.id,
        "filename": file.filename,
        "analysis": issues,
        "quality_score": quality_score,
        "syntax_review": syntax_review,
        "quality_review": quality_review,
        "ai_model": ai_review.get(
            "model",
            "CodeBERT"
        )
    }


@app.get("/reviews")
def get_reviews(
    db: Session = Depends(get_db)
):
    reviews = (
        db.query(Review)
        .order_by(
            Review.created_at.desc()
        )
        .all()
    )

    return reviews