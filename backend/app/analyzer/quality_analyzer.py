import subprocess
import re




def run_pylint(
    file_path
):

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




def run_flake8(
    file_path
):

    result = subprocess.run(

        [
            "flake8",
            file_path
        ],

        capture_output=True,

        text=True

    )


    return result.stdout




def parse_pylint(
    pylint_output
):

    issues = []


    pattern = re.compile(

        r"^(.+?):(\d+):(\d+):\s+([A-Z]\d+):\s+(.*?)\s+\((.*?)\)$"

    )


    for line in pylint_output.splitlines():

        match = pattern.match(
            line.strip()
        )


        if not match:

            continue


        line_number = int(
            match.group(2)
        )


        code = match.group(4)


        message = match.group(5)


        symbol = match.group(6)




        if code.startswith(
            ("E", "F")
        ):

            severity = "HIGH"


        elif code.startswith(
            ("W", "R")
        ):

            severity = "MEDIUM"


        else:

            severity = "LOW"




        issues.append({

            "title":
            f"Pylint: {symbol}",

            "message":
            message,

            "severity":
            severity,

            "line":
            line_number,

            "source":
            "Pylint"

        })


    return issues




def parse_flake8(
    flake8_output
):

    issues = []


    pattern = re.compile(

        r"^(.+?):(\d+):(\d+):\s+([A-Z]\d+)\s+(.*)$"

    )


    for line in flake8_output.splitlines():

        match = pattern.match(
            line.strip()
        )


        if not match:

            continue


        line_number = int(
            match.group(2)
        )


        code = match.group(4)


        message = match.group(5)




        if code.startswith(
            ("E9", "F")
        ):

            severity = "HIGH"


        elif code.startswith(
            ("E", "W")
        ):

            severity = "MEDIUM"


        else:

            severity = "LOW"




        issues.append({

            "title":
            f"Flake8: {code}",

            "message":
            message,

            "severity":
            severity,

            "line":
            line_number,

            "source":
            "Flake8"

        })


    return issues




def analyze_quality(
    file_path
):

    pylint_output = run_pylint(
        file_path
    )


    flake8_output = run_flake8(
        file_path
    )


    pylint_issues = parse_pylint(
        pylint_output
    )


    flake8_issues = parse_flake8(
        flake8_output
    )


    return {

        "pylint_raw":
        pylint_output,

        "flake8_raw":
        flake8_output,

        "pylint_issues":
        pylint_issues,

        "flake8_issues":
        flake8_issues

    }