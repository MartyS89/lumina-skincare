from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    IngredientViewSet,
    RoutineViewSet,
    RoutineStepViewSet,
    SkinScanViewSet,
    check_conflicts,
    analyze_skin_scan,
    chat_assistant,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'ingredients', IngredientViewSet, basename='ingredient')
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'steps', RoutineStepViewSet, basename='step')
router.register(r'scans', SkinScanViewSet, basename='scan')

urlpatterns = [
    path('conflicts/check/', check_conflicts, name='check-conflicts'),
    path('scans/analyze/', analyze_skin_scan, name='analyze-skin-scan'),
    path('chat/', chat_assistant, name='chat-assistant'),
    path('', include(router.urls)),
]
