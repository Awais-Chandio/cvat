from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cvat.apps.engine.models import Task

from .queries import count_shapes_by_label


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def label_counts(request, task_id: int):
    task = get_object_or_404(Task, pk=task_id)
    labels = count_shapes_by_label(task.id)
    return Response({
        "task_id": task.id,
        "total": sum(row["count"] for row in labels),
        "labels": labels,
    })
