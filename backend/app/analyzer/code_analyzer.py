import ast


def analyze_python_code(file_path):

    issues=[]


    with open(file_path,"r") as file:

        code=file.read()


    try:

        ast.parse(code)


    except SyntaxError as e:

        issues.append({

            "type":"Syntax Error",
            "message":str(e)

        })


    return issues