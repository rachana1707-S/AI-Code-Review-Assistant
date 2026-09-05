def calculate_quality_score(issues):
    score = 100

    penalties = {
        "HIGH": 12,
        "MEDIUM": 5,
        "LOW": 2
    }

    severity_caps = {
        "HIGH": 36,
        "MEDIUM": 30,
        "LOW": 20
    }

    severity_totals = {
        "HIGH": 0,
        "MEDIUM": 0,
        "LOW": 0
    }

    for issue in issues:
        severity = issue.get(
            "severity",
            "LOW"
        )

        penalty = penalties.get(
            severity,
            2
        )

        severity_totals[severity] += penalty

    for severity, total in severity_totals.items():
        score -= min(
            total,
            severity_caps[severity]
        )

    return max(
        0,
        min(
            100,
            score
        )
    )