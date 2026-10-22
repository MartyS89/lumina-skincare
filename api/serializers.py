from rest_framework import serializers
from .models import Ingredient, ConflictRule, Product, Routine, RoutineStep, SkinScan


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'


class ConflictRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConflictRule
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class RoutineStepSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = RoutineStep
        fields = ['id', 'routine', 'order', 'step_name', 'product', 'product_details', 'notes', 'is_completed']


class RoutineSerializer(serializers.ModelSerializer):
    steps = RoutineStepSerializer(many=True, read_only=True)

    class Meta:
        model = Routine
        fields = ['id', 'title', 'time_of_day', 'target_goal', 'created_at', 'updated_at', 'steps']


class SkinScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkinScan
        fields = '__all__'
