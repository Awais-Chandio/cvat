from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cvat.apps.engine.models import Task
from cvat.apps.engine.permissions import TaskPermission

from .queries import count_shapes_by_label


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def label_counts(request, task_id: int):
    task = get_object_or_404(Task, pk=task_id)
    if not TaskPermission.create_scope_view(request, task).check_access().allow:
        raise PermissionDenied("You do not have access to this task.")

    labels = count_shapes_by_label(task.id)
    return Response({
        "task_id": task.id,
        "total": sum(row["count"] for row in labels),
        "labels": labels,
    })
