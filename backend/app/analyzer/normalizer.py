def normalize_issues(issues):
    unique_issues = []
    seen = set()

    for issue in issues:
        title = issue.get("title", "")
        message = issue.get("message", "")
        line = issue.get("line")

        key = (
            message.lower().strip(),
            line
        )

        if key in seen:
            continue

        seen.add(key)

        unique_issues.append({
            "title": title,
            "message": message,
            "severity": issue.get("severity", "LOW"),
            "line": line,
            "source": issue.get("source", "AI")
        })

    return unique_issues