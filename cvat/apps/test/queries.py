from django.db.models import Count

from cvat.apps.engine.models import JobType, LabeledShape


def count_shapes_by_label(task_id: int) -> list[dict]:
    """Count drawn shapes per label for one task as a single GROUP BY in the database.

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
        .values("label__name")
        .annotate(count=Count("id"))
        .order_by("-count", "label__name")
    )
    return [{"label": row["label__name"], "count": row["count"]} for row in rows]
