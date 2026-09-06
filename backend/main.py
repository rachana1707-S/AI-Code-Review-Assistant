from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.ai_model.codebert_analyzer import analyze_with_ai
from app.analyzer.code_analyzer import analyze_python_code
from app.analyzer.quality_analyzer import analyze_quality
from app.analyzer.scoring import calculate_quality_score
from app.analyzer.normalizer import normalize_issues
from app.analyzer.language_detector import detect_language
from app.auth.auth import get_current_user
from app.auth.routes import router as auth_router
from app.database import get_db, engine
from app.models import Base, Review, User

import json
import os
import shutil

Base.metadata.create_all(
    bind=engine
)

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

app.include_router(
    auth_router
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

@app.get("/me")
def get_profile(
    current_user: User = Depends(
        get_current_user
    )
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@app.post("/upload")
async def upload_code(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename."
        )

    language = detect_language(
        file.filename
    )

    if language == "unknown":
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Upload Python, JavaScript, "
                "JSX, or Java code."
            )
        )

    safe_filename = os.path.basename(
        file.filename
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        safe_filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as code_file:
            code = code_file.read()
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file is "
                "not valid UTF-8 text."
            )
        )

    syntax_issues = []
    pylint_issues = []
    flake8_issues = []

    if language == "python":
        syntax_issues = (
            analyze_python_code(
                file_path
            )
        )

        quality_review = (
            analyze_quality(
                file_path
            )
        )

        pylint_issues = (
            quality_review.get(
                "pylint_issues",
                []
            )
        )

        flake8_issues = (
            quality_review.get(
                "flake8_issues",
                []
            )
        )

    ai_review = analyze_with_ai(
        code
    )

    ai_issues = ai_review.get(
        "suggestions",
        []
    )

    all_issues = (
        syntax_issues +
        pylint_issues +
        flake8_issues +
        ai_issues
    )

    issues = normalize_issues(
        all_issues
    )

    quality_score = (
        calculate_quality_score(
            issues
        )
    )

    review = Review(
        filename=safe_filename,
        code=code,
        quality_score=quality_score,
        analysis=json.dumps(
            issues
        ),
        user_id=current_user.id
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "id": review.id,
        "filename": safe_filename,
        "language": language,
        "analysis": issues,
        "quality_score":
            quality_score,
        "ai_model":
            ai_review.get(
                "model",
                "CodeBERT"
            )
    }

@app.get("/reviews")
def get_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    reviews = (
        db.query(Review)
        .filter(
            Review.user_id ==
            current_user.id
        )
        .order_by(
            Review.created_at.desc()
        )
        .all()
    )

    return reviews

@app.delete(
    "/reviews/{review_id}"
)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    review = (
        db.query(Review)
        .filter(
            Review.id == review_id,
            Review.user_id ==
            current_user.id
        )
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found."
        )

    db.delete(review)
    db.commit()

    return {
        "message":
            "Review deleted successfully."
    }