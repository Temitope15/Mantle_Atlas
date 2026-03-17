from backend.models.intelligence import IntelligenceResult, ScoreBreakdown
from backend.models.protocol import Protocol


def calculate_momentum_score(tvl_growth_percentage: float) -> float:
    return float(tvl_growth_percentage)


def get_momentum_rankings(protocols: list[Protocol]) -> list[IntelligenceResult]:
    ranked_protocols: list[IntelligenceResult] = []

    for protocol in protocols:
        momentum_score = calculate_momentum_score(
            protocol.tvl_growth_percentage,
        )

        ranked_protocols.append(
            IntelligenceResult(
                protocol=protocol.name,
                asset="",
                apy=0.0,
                tvl=protocol.tvl,
                scores=ScoreBreakdown(
                    yield_score=0.0,
                    gap_score=0.0,
                    momentum_score=momentum_score,
                    opportunity_score=momentum_score,
                ),
            )
        )

    ranked_protocols.sort(
        key=lambda item: item.scores.momentum_score,
        reverse=True,
    )

    return ranked_protocols
