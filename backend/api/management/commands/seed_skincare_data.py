from django.core.management.base import BaseCommand
from api.models import Ingredient, ConflictRule, Product, Routine, RoutineStep, SkinScan


class Command(BaseCommand):
    help = 'Seeds initial skincare ingredients, conflict rules, products, routines, and sample scans'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding skincare data...")

        # 1. Ingredients
        ingredients_data = [
            {
                "name": "Retinol",
                "category": "Retinoid",
                "description": "Vitamin A derivative that accelerates cell turnover, boosts collagen, and targets fine lines and acne.",
                "benefits": "Anti-aging, fine lines, texture refinement, blemish reduction",
                "comedogenic_rating": 0,
                "irritancy_rating": 3,
            },
            {
                "name": "Salicylic Acid",
                "category": "BHA Exfoliant",
                "description": "Oil-soluble beta hydroxy acid that penetrates pores to dissolve sebum and unclog blackheads.",
                "benefits": "Acne clearing, pore tightening, oil control",
                "comedogenic_rating": 0,
                "irritancy_rating": 2,
            },
            {
                "name": "Glycolic Acid",
                "category": "AHA Exfoliant",
                "description": "Water-soluble alpha hydroxy acid with small molecular size that dissolves dead surface skin cells.",
                "benefits": "Skin brightening, tone evening, hyperpigmentation fading",
                "comedogenic_rating": 0,
                "irritancy_rating": 3,
            },
            {
                "name": "Vitamin C (L-Ascorbic Acid)",
                "category": "Antioxidant",
                "description": "Potent antioxidant that neutralizes free radicals, brightens dull skin, and prevents UV photo-damage.",
                "benefits": "Radiance boost, collagen synthesis, dark spot fading",
                "comedogenic_rating": 0,
                "irritancy_rating": 2,
            },
            {
                "name": "Niacinamide",
                "category": "Vitamin B3",
                "description": "Versatile anti-inflammatory active that balances sebum, reduces redness, and strengthens the skin barrier.",
                "benefits": "Pore minimization, barrier repair, redness reduction",
                "comedogenic_rating": 0,
                "irritancy_rating": 1,
            },
            {
                "name": "Hyaluronic Acid",
                "category": "Humectant",
                "description": "Powerful hydrator capable of binding up to 1000 times its weight in water to plump dehydrated skin.",
                "benefits": "Deep hydration, plumping, skin elasticity",
                "comedogenic_rating": 0,
                "irritancy_rating": 0,
            },
            {
                "name": "Ceramides",
                "category": "Barrier Lipid",
                "description": "Essential lipids that make up 50% of the skin barrier, locking in moisture and defending against irritants.",
                "benefits": "Barrier restoration, moisture retention, soothing",
                "comedogenic_rating": 0,
                "irritancy_rating": 0,
            },
            {
                "name": "Benzoyl Peroxide",
                "category": "Acne Treatment",
                "description": "Antimicrobial active that kills Cutibacterium acnes bacteria inside pores.",
                "benefits": "Active pimple treatment, cystic acne prevention",
                "comedogenic_rating": 0,
                "irritancy_rating": 3,
            },
            {
                "name": "Centella Asiatica (Cica)",
                "category": "Soothing Botanical",
                "description": "Ancient herbal extract rich in madecassoside that calms inflammation, stinging, and redness.",
                "benefits": "Calming, wound healing, anti-redness",
                "comedogenic_rating": 0,
                "irritancy_rating": 0,
            },
        ]

        for item in ingredients_data:
            Ingredient.objects.update_or_create(name=item["name"], defaults=item)

        # 2. Conflict Rules
        conflicts_data = [
            {
                "ingredient_a": "Retinol",
                "ingredient_b": "Salicylic Acid",
                "severity": "danger",
                "reason": "Both are powerful cell-turnover agents. Layering them together damages the skin moisture barrier, triggering extreme peeling, redness, and dermatitis.",
                "suggestion": "Use Salicylic Acid on alternate mornings or nights, and keep Retinol for your evening routine only.",
            },
            {
                "ingredient_a": "Retinol",
                "ingredient_b": "Glycolic Acid",
                "severity": "danger",
                "reason": "Exfoliating AHAs paired with Retinoids cause over-exfoliation, stinging, barrier compromise, and increased UV sensitivity.",
                "suggestion": "Cycle your routine (Skin Cycling): Exfoliate on Night 1, use Retinol on Night 2, and rest with barrier hydrators on Nights 3 & 4.",
            },
            {
                "ingredient_a": "Retinol",
                "ingredient_b": "Benzoyl Peroxide",
                "severity": "danger",
                "reason": "Benzoyl peroxide can oxidize and deactivate classic Retinol molecules while causing severe flaking and irritation.",
                "suggestion": "Use Benzoyl Peroxide in the morning as a spot wash/treatment, and Retinol strictly at night.",
            },
            {
                "ingredient_a": "Vitamin C (L-Ascorbic Acid)",
                "ingredient_b": "Benzoyl Peroxide",
                "severity": "warning",
                "reason": "Benzoyl Peroxide is a potent oxidizing agent that rapidly oxidizes Vitamin C into inactive Dehydroascorbic acid, rendering both ineffective.",
                "suggestion": "Apply Vitamin C in the morning under sunscreen and Benzoyl Peroxide in the evening.",
            },
            {
                "ingredient_a": "Glycolic Acid",
                "ingredient_b": "Salicylic Acid",
                "severity": "warning",
                "reason": "Combining high-concentration AHA and BHA simultaneously can strip the acid mantle unless formulated safely together in low concentrations.",
                "suggestion": "Do not layer two separate leave-on AHA and BHA products; alternate days or use a formulated blend.",
            },
        ]

        for item in conflicts_data:
            ConflictRule.objects.update_or_create(
                ingredient_a=item["ingredient_a"],
                ingredient_b=item["ingredient_b"],
                defaults=item
            )

        # 3. Products
        products_data = [
            {
                "name": "Hydrating Facial Cleanser",
                "brand": "CeraVe",
                "category": "cleanser",
                "target_skin_types": ["dry", "normal", "sensitive"],
                "key_actives": ["Ceramides", "Hyaluronic Acid"],
                "description": "Gentle, non-foaming lotion cleanser that removes impurities while keeping the skin barrier intact.",
                "price": 14.99,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "2% BHA Liquid Exfoliant",
                "brand": "Paula's Choice",
                "category": "treatment",
                "target_skin_types": ["oily", "combination", "acne-prone"],
                "key_actives": ["Salicylic Acid"],
                "description": "Cult-favorite leave-on exfoliant that unclogs pores, smooths wrinkles, and evens skin tone.",
                "price": 35.00,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "Niacinamide 10% + Zinc 1%",
                "brand": "The Ordinary",
                "category": "serum",
                "target_skin_types": ["oily", "combination", "sensitive"],
                "key_actives": ["Niacinamide"],
                "description": "High-strength vitamin and mineral blemish formula that regulates sebum and minimizes pore size.",
                "price": 6.50,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1608248597359-5f284ec194e8?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "Retinol 0.5% in Squalane",
                "brand": "The Ordinary",
                "category": "treatment",
                "target_skin_types": ["dry", "normal", "combination"],
                "key_actives": ["Retinol"],
                "description": "Water-free solution containing 0.5% pure Retinol to refine fine lines and photo-aging signs.",
                "price": 9.20,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "C-Firma Fresh Day Serum (15% Vit C)",
                "brand": "Drunk Elephant",
                "category": "serum",
                "target_skin_types": ["all", "dull", "combination"],
                "key_actives": ["Vitamin C (L-Ascorbic Acid)"],
                "description": "Packed with a powerful antioxidant complex that dissolves surface dead skin and visibly brightens skin.",
                "price": 78.00,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "Relief Sun : Rice + Probiotics (SPF50+ PA++++)",
                "brand": "Beauty of Joseon",
                "category": "sunscreen",
                "target_skin_types": ["all", "sensitive", "dry", "combination"],
                "key_actives": ["Niacinamide"],
                "description": "Organic chemical sunscreen with a lightweight, cream texture that leaves no white cast and delivers dewy glow.",
                "price": 18.00,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60",
            },
            {
                "name": "Cicaplast Baume B5+",
                "brand": "La Roche-Posay",
                "category": "moisturizer",
                "target_skin_types": ["dry", "sensitive", "compromised"],
                "key_actives": ["Centella Asiatica (Cica)", "Ceramides"],
                "description": "Multi-repair soothing balm for irritated or compromised skin barrier, cracked skin, and extreme redness.",
                "price": 17.99,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
            },
        ]

        saved_products = {}
        for item in products_data:
            p, _ = Product.objects.update_or_create(name=item["name"], defaults=item)
            saved_products[p.name] = p

        # 4. Routines
        m_routine, _ = Routine.objects.update_or_create(
            title="Radiant Morning Glow",
            defaults={"time_of_day": "morning", "target_goal": "Hydration, Antioxidant Defense & Sun Protection"}
        )
        RoutineStep.objects.filter(routine=m_routine).delete()
        RoutineStep.objects.create(
            routine=m_routine, order=1, step_name="Gentle Cleanser",
            product=saved_products.get("Hydrating Facial Cleanser"),
            notes="Wash with lukewarm water for 60 seconds", is_completed=True
        )
        RoutineStep.objects.create(
            routine=m_routine, order=2, step_name="Brightening Serum",
            product=saved_products.get("C-Firma Fresh Day Serum (15% Vit C)"),
            notes="Press 3 drops gently into face & neck", is_completed=True
        )
        RoutineStep.objects.create(
            routine=m_routine, order=3, step_name="Dewy Sunscreen",
            product=saved_products.get("Relief Sun : Rice + Probiotics (SPF50+ PA++++)"),
            notes="Apply two finger-lengths as the final shield", is_completed=False
        )

        e_routine, _ = Routine.objects.update_or_create(
            title="Night Repair & Barrier Restoration",
            defaults={"time_of_day": "evening", "target_goal": "Cell Turnover, Pore Clearing & Deep Nourishment"}
        )
        RoutineStep.objects.filter(routine=e_routine).delete()
        RoutineStep.objects.create(
            routine=e_routine, order=1, step_name="Thorough Cleanse",
            product=saved_products.get("Hydrating Facial Cleanser"),
            notes="Remove all SPF and city pollution", is_completed=False
        )
        RoutineStep.objects.create(
            routine=e_routine, order=2, step_name="Pore Clarifier (BHA)",
            product=saved_products.get("2% BHA Liquid Exfoliant"),
            notes="Apply with cotton pad 2-3x weekly", is_completed=False
        )
        RoutineStep.objects.create(
            routine=e_routine, order=3, step_name="Barrier Recovery Cream",
            product=saved_products.get("Cicaplast Baume B5+"),
            notes="Seal in moisture to wake up plump and hydrated", is_completed=False
        )

        # 5. Sample Initial Scan
        if not SkinScan.objects.exists():
            SkinScan.objects.create(
                detected_skin_type="Combination",
                overall_score=86,
                hydration_score=78,
                redness_score=88,
                blemish_score=84,
                texture_score=82,
                detected_concerns=[
                    "Mild T-zone congestion & enlarged pores",
                    "Slight surface dehydration around eye contour",
                    "Faint redness on upper cheeks"
                ],
                ai_recommendations=[
                    "Incorporate Centella Asiatica & Ceramides to soothe localized cheek redness.",
                    "Use Salicylic Acid (BHA) 2 evenings weekly to clear pore congestion.",
                    "Ensure daily SPF 50+ reapplication to preserve collagen integrity."
                ],
                notes="Initial diagnostic scan baseline"
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded skincare database!"))
