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





def analyze_with_ai(code:str):


    """
    Analyze source code using CodeBERT embeddings
    """



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



    # CLS embedding

    embedding = (
        outputs
        .last_hidden_state[:,0,:]
    )



    # Convert tensor to score

    magnitude = torch.norm(
        embedding
    ).item()



    quality_score = min(

        100,

        int(
            magnitude * 10
        )

    )




    suggestions = []



    if len(code.splitlines()) > 300:

        suggestions.append({

            "title":
            "Large File Size",

            "message":
            "Consider splitting this file into smaller modules.",

            "severity":
            "MEDIUM"

        })




    if "print(" in code:


        suggestions.append({

            "title":
            "Debug Statements",

            "message":
            "Remove print statements before production deployment.",

            "severity":
            "LOW"

        })




    if "password" in code.lower():


        suggestions.append({

            "title":
            "Possible Credential Exposure",

            "message":
            "Avoid storing passwords directly in source code.",

            "severity":
            "HIGH"

        })





    return {


        "model":
        "microsoft/codebert-base",


        "quality_score":
        quality_score,


        "embedding_size":
        embedding.shape[1],


        "suggestions":
        suggestions


    }