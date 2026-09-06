import ast

def analyze_python_code(file_path):
    issues = []

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:
        code = file.read()

    try:
        ast.parse(code)
    except SyntaxError as error:
        issues.append({
            "title": "Python Syntax Error",
            "message": error.msg,
            "severity": "HIGH",
            "line": error.lineno,
            "source": "Python AST"
        })

    return issues