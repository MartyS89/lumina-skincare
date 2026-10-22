from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=120, unique=True)
    category = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    comedogenic_rating = models.IntegerField(default=0, help_text="0-5 pore-clogging potential")
    irritancy_rating = models.IntegerField(default=0, help_text="0-5 irritation potential")

    def __str__(self):
        return self.name


class ConflictRule(models.Model):
    SEVERITY_CHOICES = [
        ('warning', 'Caution / Separate Usage'),
        ('danger', 'Severe Conflict / Do Not Mix'),
    ]

    ingredient_a = models.CharField(max_length=120)
    ingredient_b = models.CharField(max_length=120)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='warning')
    reason = models.TextField()
    suggestion = models.TextField()

    class Meta:
        unique_together = ('ingredient_a', 'ingredient_b')

    def __str__(self):
        return f"{self.ingredient_a} + {self.ingredient_b} ({self.severity})"


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('cleanser', 'Cleanser'),
        ('toner', 'Toner / Essence'),
        ('serum', 'Serum / Ampoule'),
        ('moisturizer', 'Moisturizer / Cream'),
        ('sunscreen', 'Sunscreen (SPF)'),
        ('treatment', 'Treatment / Active'),
        ('exfoliant', 'Exfoliant'),
        ('mask', 'Mask'),
    ]

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=120)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    target_skin_types = models.JSONField(default=list, help_text="List of skin types, e.g. ['oily', 'combination']")
    key_actives = models.JSONField(default=list, help_text="List of active ingredient names")
    full_ingredients = models.TextField(blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    rating = models.FloatField(default=4.5)
    image_url = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.brand} - {self.name}"


class Routine(models.Model):
    TIME_CHOICES = [
        ('morning', 'Morning Routine'),
        ('evening', 'Evening Routine'),
        ('weekly', 'Weekly Treatment'),
    ]

    title = models.CharField(max_length=120)
    time_of_day = models.CharField(max_length=20, choices=TIME_CHOICES, default='morning')
    target_goal = models.CharField(max_length=120, blank=True, help_text="e.g. Barrier Repair, Glow, Anti-Acne")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_time_of_day_display()})"


class RoutineStep(models.Model):
    routine = models.ForeignKey(Routine, related_name='steps', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=1)
    step_name = models.CharField(max_length=100)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.order}: {self.step_name}"


class SkinScan(models.Model):
    image = models.ImageField(upload_to='scans/', null=True, blank=True)
    detected_skin_type = models.CharField(max_length=60, default='Combination')
    overall_score = models.IntegerField(default=85)
    hydration_score = models.IntegerField(default=78)
    redness_score = models.IntegerField(default=88)
    blemish_score = models.IntegerField(default=82)
    texture_score = models.IntegerField(default=80)
    detected_concerns = models.JSONField(default=list)
    ai_recommendations = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Scan {self.id} - Score: {self.overall_score}% ({self.created_at.strftime('%Y-%m-%d')})"

