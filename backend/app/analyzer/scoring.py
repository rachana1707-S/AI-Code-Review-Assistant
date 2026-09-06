def calculate_quality_score(issues):
    score = 100

    penalties = {
        "HIGH": 12,
        "MEDIUM": 5,
        "LOW": 2
    }

    severity_caps = {
        "HIGH": 48,
        "MEDIUM": 30,
        "LOW": 20
    }

    severity_totals = {
        "HIGH": 0,
        "MEDIUM": 0,
        "LOW": 0
    }

    for issue in issues:
        severity = (
            issue.get(
                "severity",
                "LOW"
            )
            .upper()
        )

        if severity not in penalties:
            severity = "LOW"

        severity_totals[severity] += (
            penalties[severity]
        )

    for severity in severity_totals:
        score -= min(
            severity_totals[severity],
            severity_caps[severity]
        )

    return max(
        0,
        min(
            100,
            score
        )
    )