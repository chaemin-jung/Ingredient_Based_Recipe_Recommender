from app.services.recommendation_engine import calculate_recipe_score


def test_calculate_recipe_score_uses_weighted_formula() -> None:
    score, matched, missing = calculate_recipe_score(
        {"tomato", "garlic", "basil"},
        ["tomato", "garlic", "olive oil", "basil"],
    )

    assert matched == ["basil", "garlic", "tomato"]
    assert missing == ["olive oil"]
    assert score == 0.75
