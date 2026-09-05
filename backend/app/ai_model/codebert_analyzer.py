import re

import torch

from transformers import (
    AutoTokenizer,
    AutoModel
)


MODEL_NAME = "microsoft/codebert-base"


print("Loading CodeBERT model...")


tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)


model = AutoModel.from_pretrained(
    MODEL_NAME
)


model.eval()


print("CodeBERT loaded successfully")




def get_line_number(
    code: str,
    pattern: str
):

    lines = code.splitlines()


    for index, line in enumerate(
        lines,
        start=1
    ):

        if pattern.lower() in line.lower():

            return index


    return None




def analyze_with_ai(
    code: str
):

    # -------------------------------------------------
    # CodeBERT Embedding
    # -------------------------------------------------

    inputs = tokenizer(

        code,

        return_tensors="pt",

        truncation=True,

        padding=True,

        max_length=512

    )


    with torch.no_grad():

        outputs = model(
            **inputs
        )


    embedding = (

        outputs
        .last_hidden_state[
            :,
            0,
            :
        ]

    )



    # -------------------------------------------------
    # Findings
    # -------------------------------------------------

    suggestions = []




    # -------------------------------------------------
    # Large File
    # -------------------------------------------------

    line_count = len(
        code.splitlines()
    )


    if line_count > 300:

        suggestions.append({

            "title":
            "Large File Size",

            "message":
            "Consider splitting this file into smaller modules.",

            "severity":
            "MEDIUM",

            "line":
            1

        })




    # -------------------------------------------------
    # Debug Print Statements
    # -------------------------------------------------

    print_match = re.search(
        r"\bprint\s*\(",
        code
    )


    if print_match:

        suggestions.append({

            "title":
            "Debug Statements",

            "message":
            "Remove print statements before production deployment.",

            "severity":
            "LOW",

            "line":
            get_line_number(
                code,
                "print("
            )

        })




    # -------------------------------------------------
    # Possible Password Exposure
    # -------------------------------------------------

    password_match = re.search(

        r"(password|passwd|pwd)\s*=\s*[\"'][^\"']+[\"']",

        code,

        re.IGNORECASE

    )


    if password_match:

        suggestions.append({

            "title":
            "Possible Credential Exposure",

            "message":
            "Avoid storing passwords directly in source code.",

            "severity":
            "HIGH",

            "line":
            get_line_number(
                code,
                "password"
            )

        })




    # -------------------------------------------------
    # Possible Secret / API Key Exposure
    # -------------------------------------------------

    secret_patterns = [

        "api_key",

        "apikey",

        "secret_key",

        "access_token"

    ]


    for pattern in secret_patterns:

        if pattern.lower() in code.lower():

            suggestions.append({

                "title":
                "Possible Secret Exposure",

                "message":
                "Sensitive keys or tokens should be stored in environment variables.",

                "severity":
                "HIGH",

                "line":
                get_line_number(
                    code,
                    pattern
                )

            })

            break




    # -------------------------------------------------
    # Bare Exception Handling
    # -------------------------------------------------

    bare_except = re.search(

        r"except\s*:",

        code

    )


    if bare_except:

        suggestions.append({

            "title":
            "Broad Exception Handling",

            "message":
            "Avoid bare except blocks. Catch specific exception types.",

            "severity":
            "MEDIUM",

            "line":
            get_line_number(
                code,
                "except:"
            )

        })




    # -------------------------------------------------
    # Dangerous eval()
    # -------------------------------------------------

    eval_match = re.search(

        r"\beval\s*\(",

        code

    )


    if eval_match:

        suggestions.append({

            "title":
            "Unsafe eval() Usage",

            "message":
            "Avoid eval() because it can execute arbitrary code.",

            "severity":
            "HIGH",

            "line":
            get_line_number(
                code,
                "eval("
            )

        })




    # -------------------------------------------------
    # TODO/FIXME
    # -------------------------------------------------

    if (
        "TODO" in code
        or
        "FIXME" in code
    ):

        suggestions.append({

            "title":
            "Unfinished Code",

            "message":
            "TODO or FIXME comments may indicate unfinished implementation.",

            "severity":
            "LOW",

            "line":
            get_line_number(
                code,
                "TODO"
            )
            or
            get_line_number(
                code,
                "FIXME"
            )

        })




    # -------------------------------------------------
    # Very Long Lines
    # -------------------------------------------------

    for index, line in enumerate(
        code.splitlines(),
        start=1
    ):

        if len(line) > 100:

            suggestions.append({

                "title":
                "Long Line",

                "message":
                "This line is longer than 100 characters and may reduce readability.",

                "severity":
                "LOW",

                "line":
                index

            })

            break




    # -------------------------------------------------
    # CodeBERT Metadata Only
    # -------------------------------------------------

    return {

        "model":
        MODEL_NAME,

        "embedding_size":
        embedding.shape[1],

        "suggestions":
        suggestions

    }