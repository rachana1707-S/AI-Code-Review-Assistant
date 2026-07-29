import subprocess


def run_pylint(file_path):

    result = subprocess.run(
        [
            "pylint",
            file_path,
            "--output-format=text"
        ],
        capture_output=True,
        text=True
    )


    return result.stdout



def run_flake8(file_path):

    result = subprocess.run(
        [
            "flake8",
            file_path
        ],
        capture_output=True,
        text=True
    )


    return result.stdout



def analyze_quality(file_path):

    pylint_result = run_pylint(file_path)

    flake8_result = run_flake8(file_path)


    return {

        "pylint": pylint_result,

        "flake8": flake8_result

    }