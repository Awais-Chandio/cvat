from django.db.models import Count

from cvat.apps.engine.models import JobType, LabeledShape


def count_shapes_by_label(task_id: int) -> list[dict]:
    """Count drawn shapes per label and shape type for one task in a single GROUP BY.

    Only annotation jobs are counted: ground truth and consensus jobs hold copies
    of the same objects and would inflate the totals. Skeleton points (shapes with
    a parent) are counted through their parent only.
    """
    rows = (
        LabeledShape.objects.filter(
            job__segment__task_id=task_id,
            job__type=JobType.ANNOTATION,
            parent__isnull=True,
        )
        .values("label__name", "type")
        .annotate(count=Count("id"))
    )

    per_label: dict[str, dict] = {}
    for row in rows:
        entry = per_label.setdefault(
            row["label__name"], {"label": row["label__name"], "count": 0, "types": {}}
        )
        entry["count"] += row["count"]
        entry["types"][row["type"]] = row["count"]

    return sorted(per_label.values(), key=lambda entry: (-entry["count"], entry["label"]))
