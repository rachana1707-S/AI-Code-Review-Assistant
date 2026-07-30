from transformers import pipeline



review_model = pipeline(
    "text-classification",
    model="microsoft/codebert-base"
)



def analyze_with_ai(code):

    result = review_model(
        code[:512]
    )


    return result