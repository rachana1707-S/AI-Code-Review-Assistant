import os

def detect_language(filename):
    extension = os.path.splitext(filename)[1].lower()

    languages = {
        ".py": "python",
        ".js": "javascript",
        ".jsx": "javascript",
        ".java": "java"
    }

    return languages.get(extension, "unknown")