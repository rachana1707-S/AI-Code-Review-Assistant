from fastapi import FastAPI

app = FastAPI(
    title="AI Code Review Assistant"
)


@app.get("/")
def home():
    return {
        "message":"AI Code Review Assistant API Running"
    }