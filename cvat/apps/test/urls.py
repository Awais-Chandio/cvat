from django.urls import path

from . import views

urlpatterns = [
    path("tasks/<int:task_id>/label-counts", views.label_counts, name="test-label-counts"),
]
