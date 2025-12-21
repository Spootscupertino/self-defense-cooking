import json
import os
from typing import Dict, List

BASES = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'recipes')),
]

PROFILES = {
    'baked_chicken': {
        'macros': {'protein': 38, 'carbs': 6, 'fat': 14},
        'nutrition': {'calories': 360, 'sodium': 520, 'saturatedFat': 4.5, 'fiber': 1, 'sugar': 1},
        'price': 3.75,
        'time': {'prepMinutes': 10, 'cookMinutes': 28},
        'difficulty': 'Easy'
    },
    'baked_pork': {
        'macros': {'protein': 35, 'carbs': 8, 'fat': 18},
        'nutrition': {'calories': 410, 'sodium': 560, 'saturatedFat': 6, 'fiber': 1, 'sugar': 2},
        'price': 3.6,
        'time': {'prepMinutes': 10, 'cookMinutes': 30},
        'difficulty': 'Easy'
    },
    'seafood': {
        'macros': {'protein': 34, 'carbs': 4, 'fat': 12},
        'nutrition': {'calories': 320, 'sodium': 460, 'saturatedFat': 3, 'fiber': 0, 'sugar': 0},
        'price': 4.5,
        'time': {'prepMinutes': 10, 'cookMinutes': 18},
        'difficulty': 'Easy'
    },
    'sheet_pan': {
        'macros': {'protein': 32, 'carbs': 24, 'fat': 14},
        'nutrition': {'calories': 420, 'sodium': 520, 'saturatedFat': 4, 'fiber': 4, 'sugar': 5},
        'price': 3.8,
        'time': {'prepMinutes': 12, 'cookMinutes': 25},
        'difficulty': 'Easy'
    },
    'pasta_creamy': {
        'macros': {'protein': 27, 'carbs': 60, 'fat': 22},
        'nutrition': {'calories': 620, 'sodium': 720, 'saturatedFat': 11, 'fiber': 3, 'sugar': 6},
        'price': 3.2,
        'time': {'prepMinutes': 15, 'cookMinutes': 25},
        'difficulty': 'Medium'
    },
    'pasta_meaty': {
        'macros': {'protein': 32, 'carbs': 58, 'fat': 20},
        'nutrition': {'calories': 620, 'sodium': 780, 'saturatedFat': 9, 'fiber': 4, 'sugar': 8},
        'price': 3.5,
        'time': {'prepMinutes': 20, 'cookMinutes': 45},
        'difficulty': 'Medium'
    },
    'soup': {
        'macros': {'protein': 24, 'carbs': 28, 'fat': 10},
        'nutrition': {'calories': 360, 'sodium': 780, 'saturatedFat': 3, 'fiber': 4, 'sugar': 6},
        'price': 2.5,
        'time': {'prepMinutes': 15, 'cookMinutes': 30},
        'difficulty': 'Easy'
    },
    'stew': {
        'macros': {'protein': 32, 'carbs': 34, 'fat': 16},
        'nutrition': {'calories': 520, 'sodium': 820, 'saturatedFat': 6, 'fiber': 4, 'sugar': 5},
        'price': 3.9,
        'time': {'prepMinutes': 20, 'cookMinutes': 90},
        'difficulty': 'Medium'
    },
    'chili': {
        'macros': {'protein': 30, 'carbs': 35, 'fat': 14},
        'nutrition': {'calories': 480, 'sodium': 860, 'saturatedFat': 5, 'fiber': 8, 'sugar': 8},
        'price': 3.2,
        'time': {'prepMinutes': 20, 'cookMinutes': 50},
        'difficulty': 'Easy'
    },
    'rice': {
        'macros': {'protein': 18, 'carbs': 55, 'fat': 14},
        'nutrition': {'calories': 450, 'sodium': 780, 'saturatedFat': 3, 'fiber': 2, 'sugar': 3},
        'price': 2.1,
        'time': {'prepMinutes': 15, 'cookMinutes': 20},
        'difficulty': 'Easy'
    },
    'taco': {
        'macros': {'protein': 28, 'carbs': 32, 'fat': 14},
        'nutrition': {'calories': 430, 'sodium': 820, 'saturatedFat': 5, 'fiber': 4, 'sugar': 3},
        'price': 3.0,
        'time': {'prepMinutes': 15, 'cookMinutes': 20},
        'difficulty': 'Easy'
    },
    'breakfast': {
        'macros': {'protein': 15, 'carbs': 48, 'fat': 12},
        'nutrition': {'calories': 360, 'sodium': 420, 'saturatedFat': 5, 'fiber': 2, 'sugar': 10},
        'price': 1.8,
        'time': {'prepMinutes': 10, 'cookMinutes': 15},
        'difficulty': 'Easy'
    },
    'dessert_cookie': {
        'macros': {'protein': 4, 'carbs': 45, 'fat': 18},
        'nutrition': {'calories': 320, 'sodium': 180, 'saturatedFat': 10, 'fiber': 1, 'sugar': 26},
        'price': 0.9,
        'time': {'prepMinutes': 15, 'cookMinutes': 12},
        'difficulty': 'Easy'
    },
    'dessert_bread': {
        'macros': {'protein': 5, 'carbs': 55, 'fat': 12},
        'nutrition': {'calories': 310, 'sodium': 260, 'saturatedFat': 5, 'fiber': 3, 'sugar': 24},
        'price': 1.2,
        'time': {'prepMinutes': 15, 'cookMinutes': 55},
        'difficulty': 'Easy'
    },
    'sauce': {
        'macros': {'protein': 2, 'carbs': 6, 'fat': 4},
        'nutrition': {'calories': 60, 'sodium': 180, 'saturatedFat': 0.5, 'fiber': 1, 'sugar': 4},
        'price': 0.5,
        'time': {'prepMinutes': 10, 'cookMinutes': 20},
        'difficulty': 'Easy'
    },
    'side': {
        'macros': {'protein': 6, 'carbs': 32, 'fat': 10},
        'nutrition': {'calories': 240, 'sodium': 360, 'saturatedFat': 4, 'fiber': 3, 'sugar': 3},
        'price': 1.1,
        'time': {'prepMinutes': 15, 'cookMinutes': 25},
        'difficulty': 'Easy'
    },
    'burger': {
        'macros': {'protein': 32, 'carbs': 30, 'fat': 18},
        'nutrition': {'calories': 520, 'sodium': 780, 'saturatedFat': 8, 'fiber': 2, 'sugar': 5},
        'price': 3.4,
        'time': {'prepMinutes': 15, 'cookMinutes': 12},
        'difficulty': 'Easy'
    },
    'sandwich': {
        'macros': {'protein': 18, 'carbs': 32, 'fat': 16},
        'nutrition': {'calories': 420, 'sodium': 720, 'saturatedFat': 7, 'fiber': 2, 'sugar': 5},
        'price': 2.2,
        'time': {'prepMinutes': 10, 'cookMinutes': 8},
        'difficulty': 'Easy'
    }
}

def make_recipe(title: str, slug: str, ingredients: List[Dict], directions: List[str], profile: str, notes: str = '',
                yield_serv: int = 4, difficulty: str = None, price_per: float = None, time_override: Dict = None,
                currency: str = 'USD') -> Dict:
    meta = PROFILES[profile]
    difficulty = difficulty or meta['difficulty']
    price_per = price_per if price_per is not None else meta['price']
    time_data = time_override or meta['time']
    prep = time_data['prepMinutes']
    cook = time_data['cookMinutes']
    return {
        'title': title,
        'slug': slug,
        'yield': yield_serv,
        'ingredients': ingredients,
        'directions': directions,
        'nutrition': meta['nutrition'],
        'macros': meta['macros'],
        'price': {
            'perServing': round(price_per, 2),
            'currency': currency,
            'total': round(price_per * yield_serv, 2)
        },
        'difficulty': difficulty,
        'time': {
            'prepMinutes': prep,
            'cookMinutes': cook,
            'totalMinutes': prep + cook
        },
        'notes': notes
    }

def baked_protein(title: str, slug: str, protein: str, rub=None, glaze: str = None, profile: str = 'baked_chicken',
                  cook_minutes: int = 30, notes: str = '') -> Dict:
    rub = rub or ['garlic powder', 'smoked paprika', 'dried thyme']
    ingredients = [
        {'quantity': '2', 'unit': 'lb', 'name': protein},
        {'quantity': '2', 'unit': 'tablespoons', 'name': 'olive oil'},
        {'quantity': '1.5', 'unit': 'teaspoons', 'name': 'kosher salt'},
        {'quantity': '1', 'unit': 'teaspoon', 'name': 'black pepper'},
    ] + [{'quantity': '1', 'unit': 'teaspoon', 'name': spice} for spice in rub]
    if glaze:
        ingredients.append({'quantity': '1/3', 'unit': 'cup', 'name': glaze})
    directions = [
        'Preheat oven to 400F and line a sheet pan.',
        'Pat protein dry, then coat with oil, salt, pepper, and spices.' + (' Toss with glaze to coat evenly.' if glaze else ''),
        f'Roast for {cook_minutes - 5}-{cook_minutes + 5} minutes, flipping once, until browned and cooked through (165F for poultry, 145F for pork).',
        'Rest 5 minutes and serve with pan juices.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes,
                       time_override={'prepMinutes': 10, 'cookMinutes': cook_minutes})

def sheet_pan(title: str, slug: str, protein: str, veggies: List[str], seasoning: str, sauce: str = None,
              profile: str = 'sheet_pan', cook_minutes: int = 25, notes: str = '') -> Dict:
    ingredients = [
        {'quantity': '1.5', 'unit': 'lb', 'name': protein},
        {'quantity': '3', 'unit': 'cups', 'name': ', '.join(veggies)},
        {'quantity': '3', 'unit': 'tablespoons', 'name': 'olive oil'},
        {'quantity': '1.5', 'unit': 'teaspoons', 'name': 'kosher salt'},
        {'quantity': '1', 'unit': 'teaspoon', 'name': 'black pepper'},
        {'quantity': '2', 'unit': 'teaspoons', 'name': seasoning}
    ]
    if sauce:
        ingredients.append({'quantity': '1/4', 'unit': 'cup', 'name': sauce})
    directions = [
        'Heat oven to 425F and preheat a rimmed sheet pan.',
        f'Toss {protein} and vegetables with oil, salt, pepper, and seasoning.' + (f' Add {sauce} before roasting.' if sauce else ''),
        f'Spread in one layer; roast {cook_minutes - 3}-{cook_minutes + 3} minutes, stirring once, until protein is cooked and vegetables are tender.',
        'Finish with lemon juice or herbs if desired.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes,
                       time_override={'prepMinutes': 12, 'cookMinutes': cook_minutes})

def soup_recipe(title: str, slug: str, protein: str, starch: str, veggies: List[str], broth: str = 'chicken broth',
                profile: str = 'soup', simmer: int = 30, notes: str = '') -> Dict:
    ingredients = [
        {'quantity': '1', 'unit': 'tablespoon', 'name': 'olive oil'},
        {'quantity': '1', 'unit': '', 'name': 'yellow onion, diced'},
        {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'},
        {'quantity': '3', 'unit': '', 'name': 'carrots, sliced'},
        {'quantity': '2', 'unit': 'stalks', 'name': 'celery, sliced'},
        {'quantity': '6', 'unit': 'cups', 'name': broth},
        {'quantity': '2', 'unit': 'cups', 'name': starch},
        {'quantity': '1.5', 'unit': 'teaspoons', 'name': 'kosher salt'},
        {'quantity': '0.5', 'unit': 'teaspoon', 'name': 'black pepper'},
        {'quantity': '1', 'unit': 'teaspoon', 'name': 'dried thyme'}
    ]
    if protein:
        ingredients.append({'quantity': '2', 'unit': 'cups', 'name': protein})
    ingredients += [{'quantity': '1', 'unit': 'cup', 'name': veg} for veg in veggies]
    directions = [
        'Sweat onion, carrot, and celery in oil with a pinch of salt until softened.',
        'Stir in garlic (and protein if raw) until fragrant or lightly browned.',
        'Add broth, starch, remaining salt, pepper, and thyme; bring to a simmer.',
        f'Cook {simmer} minutes until vegetables are tender; adjust seasoning and serve.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes,
                       time_override={'prepMinutes': 15, 'cookMinutes': simmer})

def stew_recipe(title: str, slug: str, protein: str, veggies: List[str], starch: str = None, profile: str = 'stew',
                simmer: int = 90, notes: str = '') -> Dict:
    ingredients = [
        {'quantity': '2', 'unit': 'lb', 'name': protein},
        {'quantity': '2', 'unit': 'tablespoons', 'name': 'olive oil'},
        {'quantity': '1.5', 'unit': 'teaspoons', 'name': 'kosher salt'},
        {'quantity': '1', 'unit': 'teaspoon', 'name': 'black pepper'},
        {'quantity': '2', 'unit': 'tablespoons', 'name': 'tomato paste'},
        {'quantity': '3', 'unit': 'cloves', 'name': 'garlic, minced'},
        {'quantity': '1', 'unit': 'cup', 'name': 'dry red wine'},
        {'quantity': '4', 'unit': 'cups', 'name': 'broth'}
    ] + [{'quantity': '2', 'unit': 'cups', 'name': veg} for veg in veggies]
    if starch:
        ingredients.append({'quantity': '2', 'unit': 'cups', 'name': starch})
    directions = [
        f'Sear {protein} in batches in oil until browned; set aside.',
        'Saute aromatics and tomato paste until darkened, then deglaze with wine.',
        'Return meat with broth and vegetables; bring to a simmer and cover.',
        f'Simmer gently {simmer - 15}-{simmer + 15} minutes until tender; season to taste.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes,
                       time_override={'prepMinutes': 20, 'cookMinutes': simmer})

def taco_recipe(title: str, slug: str, protein: str, seasoning: str, extras: List[str] = None, profile: str = 'taco',
                notes: str = '') -> Dict:
    extras = extras or []
    ingredients = [
        {'quantity': '1', 'unit': 'lb', 'name': protein},
        {'quantity': '1', 'unit': '', 'name': 'small onion, diced'},
        {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'},
        {'quantity': '1', 'unit': 'tablespoon', 'name': seasoning},
        {'quantity': '0.5', 'unit': 'cup', 'name': 'salsa or tomato sauce'},
        {'quantity': '8', 'unit': '', 'name': 'warm tortillas'},
        {'quantity': '1', 'unit': 'cup', 'name': 'shredded lettuce'},
        {'quantity': '1', 'unit': 'cup', 'name': 'shredded cheese'}
    ] + [{'quantity': '0.5', 'unit': 'cup', 'name': item} for item in extras]
    directions = [
        'Brown protein with onion in a skillet; drain excess fat if needed.',
        'Stir in garlic and seasoning until fragrant.',
        'Add salsa and a splash of water; simmer 5-8 minutes until thickened.',
        'Serve in warm tortillas with cheese, lettuce, and toppings.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes)

def rice_recipe(title: str, slug: str, add_ins: List[str], protein: str = None, profile: str = 'rice', notes: str = '') -> Dict:
    ingredients: List[Dict] = []
    if protein:
        ingredients.append({'quantity': '0.75', 'unit': 'lb', 'name': protein})
    ingredients.extend([
        {'quantity': '3', 'unit': 'cups', 'name': 'cooked rice, chilled'},
        {'quantity': '2', 'unit': '', 'name': 'eggs, beaten'},
        {'quantity': '1', 'unit': 'cup', 'name': 'mixed vegetables'},
        {'quantity': '3', 'unit': 'tablespoons', 'name': 'soy sauce'},
        {'quantity': '2', 'unit': 'tablespoons', 'name': 'neutral oil'},
        {'quantity': '2', 'unit': 'teaspoons', 'name': 'sesame oil'},
    ])
    ingredients += [{'quantity': '0.5', 'unit': 'cup', 'name': item} for item in add_ins]
    directions = [
        'Heat a wok or skillet over medium-high; scramble eggs in a little oil, then set aside.',
        'Add oil and protein if using; cook through and move to the side.',
        'Stir-fry vegetables, then add rice; cook until hot and lightly crisp.',
        'Stir in soy sauce, sesame oil, add-ins, and eggs; season to taste.'
    ]
    return make_recipe(title, slug, ingredients, directions, profile, notes=notes,
                       time_override={'prepMinutes': 15, 'cookMinutes': 15})

def dessert_recipe(title: str, slug: str, style: str, profile: str) -> Dict:
    if style == 'cookies':
        ingredients = [
            {'quantity': '1', 'unit': 'cup', 'name': 'unsalted butter, softened'},
            {'quantity': '1', 'unit': 'cup', 'name': 'brown sugar'},
            {'quantity': '0.5', 'unit': 'cup', 'name': 'granulated sugar'},
            {'quantity': '2', 'unit': '', 'name': 'eggs'},
            {'quantity': '2.5', 'unit': 'cups', 'name': 'all-purpose flour'},
            {'quantity': '1', 'unit': 'teaspoon', 'name': 'baking soda'},
            {'quantity': '1', 'unit': 'teaspoon', 'name': 'salt'},
            {'quantity': '2', 'unit': 'cups', 'name': 'chocolate chips'}
        ]
        directions = [
            'Heat oven to 350F. Cream butter and sugars until fluffy; beat in eggs.',
            'Stir in dry ingredients until just combined, then fold in chocolate chips.',
            'Scoop onto parchment-lined sheets.',
            'Bake 10-12 minutes until edges are golden; cool on a rack.'
        ]
    elif style == 'banana_bread':
        ingredients = [
            {'quantity': '3', 'unit': '', 'name': 'ripe bananas, mashed'},
            {'quantity': '0.5', 'unit': 'cup', 'name': 'melted butter'},
            {'quantity': '0.75', 'unit': 'cup', 'name': 'brown sugar'},
            {'quantity': '2', 'unit': '', 'name': 'eggs'},
            {'quantity': '1.5', 'unit': 'cups', 'name': 'all-purpose flour'},
            {'quantity': '1', 'unit': 'teaspoon', 'name': 'baking soda'},
            {'quantity': '0.5', 'unit': 'teaspoon', 'name': 'salt'},
            {'quantity': '1', 'unit': 'teaspoon', 'name': 'cinnamon'}
        ]
        directions = [
            'Heat oven to 350F and grease a loaf pan.',
            'Whisk mashed bananas, butter, sugar, and eggs until smooth.',
            'Fold in dry ingredients until just combined.',
            'Bake 50-60 minutes until a tester is clean; cool before slicing.'
        ]
    else:
        ingredients, directions = [], []
    return make_recipe(title, slug, ingredients, directions, profile)

def sauce_recipe(title: str, slug: str, fresh: List[Dict], profile: str = 'sauce', cook: bool = False, notes: str = '') -> Dict:
    if cook:
        directions = [
            'Saute aromatics in oil until fragrant.',
            'Add tomatoes and seasonings; simmer 15-20 minutes.',
            'Adjust salt and sweetness to taste.',
            'Cool slightly and serve or store.'
        ]
    else:
        directions = [
            'Combine all ingredients in a bowl.',
            'Season to taste with salt and acid.',
            'Let sit 10 minutes to meld flavors.',
            'Serve fresh or chill up to 3 days.'
        ]
    return make_recipe(title, slug, fresh, directions, profile, notes=notes,
                       time_override={'prepMinutes': 10, 'cookMinutes': 0 if not cook else 20})

def breakfast_recipe(title: str, slug: str, ingredients: List[Dict], directions: List[str], notes: str = '') -> Dict:
    return make_recipe(title, slug, ingredients, directions, 'breakfast', notes=notes)

recipes: Dict[str, Dict] = {}

def add(slug: str, recipe: Dict) -> None:
    recipes[slug] = recipe

# Baked chicken family
baked_variants = [
    ('baked-bbq-chicken', 'Baked BBQ Chicken', ['garlic powder', 'smoked paprika', 'onion powder'], 'BBQ sauce', 32,
     'Sticky-sweet oven barbecue without the grill.'),
    ('baked-buffalo-chicken', 'Baked Buffalo Chicken', ['garlic powder', 'onion powder'], 'buffalo sauce', 30,
     'Oven-crisp chicken finished in buffalo sauce.'),
    ('baked-cajun-chicken', 'Baked Cajun Chicken', ['cajun seasoning', 'garlic powder'], None, 28,
     'Smoky-spicy cajun baked chicken.'),
    ('baked-greek-chicken', 'Baked Greek Chicken', ['oregano', 'garlic powder', 'lemon zest'], 'olive oil and lemon', 30,
     'Herby lemon-oregano roasted chicken.'),
    ('baked-teriyaki-chicken', 'Baked Teriyaki Chicken', ['ginger powder', 'garlic powder'], 'teriyaki sauce', 30,
     'Sticky-sweet baked teriyaki chicken.'),
]
for slug, title, rub, glaze, cook_mins, note in baked_variants:
    add(slug, baked_protein(title, slug, 'bone-in chicken pieces', rub=rub, glaze=glaze,
                            cook_minutes=cook_mins, notes=note))

add('baked-chicken-breasts', baked_protein('Baked Chicken Breasts', 'baked-chicken-breasts',
                                           'boneless skinless chicken breasts',
                                           rub=['garlic powder', 'paprika', 'Italian seasoning'], cook_minutes=26,
                                           notes='Juicy boneless breasts with a simple rub.'))
add('baked-chicken-cutlets', baked_protein('Baked Chicken Cutlets', 'baked-chicken-cutlets', 'thin chicken cutlets',
                                          rub=['garlic powder', 'paprika', 'oregano'], cook_minutes=18,
                                          notes='Quick-baked cutlets ready for sandwiches or salads.'))
add('baked-chicken-drumsticks', baked_protein('Baked Chicken Drumsticks', 'baked-chicken-drumsticks', 'chicken drumsticks',
                                             rub=['smoked paprika', 'garlic powder', 'brown sugar'], cook_minutes=35,
                                             notes='Crowd-pleasing drumsticks with crisp skin.'))
add('baked-chicken-legs', baked_protein('Baked Chicken Legs', 'baked-chicken-legs', 'chicken leg quarters',
                                       rub=['paprika', 'garlic powder', 'rosemary'], cook_minutes=40,
                                       notes='Roasted leg quarters with golden skin.'))
add('baked-chicken-thighs', baked_protein('Baked Chicken Thighs', 'baked-chicken-thighs', 'bone-in chicken thighs',
                                         rub=['garlic powder', 'smoked paprika', 'brown sugar'], cook_minutes=32,
                                         notes='Juicy dark meat with caramelized edges.'))
add('baked-chicken-wings', baked_protein('Baked Chicken Wings', 'baked-chicken-wings', 'chicken wings',
                                        rub=['baking powder', 'garlic powder', 'paprika'], cook_minutes=40,
                                        notes='Crispy oven-baked wings ready for sauce.'))
add('lemon-garlic-chicken', baked_protein('Lemon Garlic Chicken', 'lemon-garlic-chicken', 'bone-in chicken thighs',
                                         rub=['lemon zest', 'garlic powder', 'oregano'], glaze='lemon juice',
                                         cook_minutes=32, notes='Bright lemon-garlic roasted chicken.'))
add('paprika-roasted-chicken', baked_protein('Paprika Roasted Chicken', 'paprika-roasted-chicken', 'whole chicken pieces',
                                            rub=['sweet paprika', 'garlic powder', 'onion powder'], cook_minutes=40,
                                            notes='Paprika-rich roast with crisp skin.'))
add('roast-chicken', baked_protein('Roast Chicken', 'roast-chicken', 'whole chicken pieces',
                                  rub=['garlic powder', 'paprika', 'thyme'], cook_minutes=55,
                                  notes='Classic roasted chicken for carving.'))
add('oven-roasted-chicken-quarters', baked_protein('Oven Roasted Chicken Quarters', 'oven-roasted-chicken-quarters',
                                                  'chicken leg quarters', rub=['garlic powder', 'paprika', 'oregano'],
                                                  cook_minutes=45, notes='Hearty roasted quarters with crispy skin.'))
add('roasted-turkey-breast', baked_protein('Roasted Turkey Breast', 'roasted-turkey-breast', 'bone-in turkey breast',
                                         rub=['garlic powder', 'sage', 'thyme'], cook_minutes=70,
                                         notes='Small-batch roasted turkey breast.', profile='baked_chicken'))
add('crispy-oven-wings', baked_protein('Crispy Oven Wings', 'crispy-oven-wings', 'chicken wings',
                                      rub=['baking powder', 'garlic powder', 'smoked paprika'], cook_minutes=45,
                                      notes='Extra-crispy wings ready for sauce.'))
add('chicken-stir-fry', make_recipe('Chicken Stir Fry', 'chicken-stir-fry', [
    {'quantity': '1', 'unit': 'lb', 'name': 'chicken breast, sliced'},
    {'quantity': '4', 'unit': 'cups', 'name': 'mixed stir-fry vegetables'},
    {'quantity': '3', 'unit': 'tablespoons', 'name': 'soy sauce'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'oyster sauce'},
    {'quantity': '1', 'unit': 'tablespoon', 'name': 'cornstarch'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'oil'}
], [
    'Toss sliced chicken with 1 tablespoon soy sauce and cornstarch.',
    'Stir-fry chicken in hot oil until just cooked; remove.',
    'Stir-fry vegetables until crisp-tender.',
    'Return chicken with remaining sauces; toss until glazed.'
], 'rice', notes='Weeknight stir-fry with glossy soy glaze.', time_override={'prepMinutes': 15, 'cookMinutes': 12}))

# Pork
add('baked-pork-chops', baked_protein('Baked Pork Chops', 'baked-pork-chops', 'bone-in pork chops', profile='baked_pork',
                                     rub=['garlic powder', 'paprika', 'brown sugar'], cook_minutes=24,
                                     notes='Juicy chops with a sweet-smoky rub.'))
add('honey-mustard-pork-chops', baked_protein('Honey Mustard Pork Chops', 'honey-mustard-pork-chops', 'boneless pork chops',
                                            profile='baked_pork', rub=['garlic powder', 'paprika'], glaze='honey mustard',
                                            cook_minutes=22, notes='Tangy-sweet glaze that caramelizes.'))
add('herb-roasted-pork-tenderloin', baked_protein('Herb Roasted Pork Tenderloin', 'herb-roasted-pork-tenderloin', 'pork tenderloin',
                                                 profile='baked_pork', rub=['garlic powder', 'rosemary', 'thyme'],
                                                 cook_minutes=25, notes='Lean tenderloin roasted to 145F and rested.'))
add('baked-ham-steak', baked_protein('Baked Ham Steak', 'baked-ham-steak', 'thick ham steak', profile='baked_pork',
                                   rub=['mustard powder', 'brown sugar'], glaze='maple syrup', cook_minutes=18,
                                   notes='Quick oven-glazed ham with caramelized edges.'))
add('sheet-pan-pork-chops', sheet_pan('Sheet Pan Pork Chops', 'sheet-pan-pork-chops', 'pork chops',
                                     veggies=['green beans', 'potatoes'], seasoning='garlic powder', notes='Pork chops roasted with beans and potatoes.',
                                     cook_minutes=24))
add('sheet-pan-pork-tenderloin', sheet_pan('Sheet Pan Pork Tenderloin', 'sheet-pan-pork-tenderloin', 'pork tenderloin medallions',
                                         veggies=['sweet potatoes', 'brussels sprouts'], seasoning='smoked paprika', sauce='mustard vinaigrette',
                                         notes='Tender pork with roasted vegetables.', cook_minutes=24))

# Beef and sausage
add('oven-roasted-beef', baked_protein('Oven Roasted Beef', 'oven-roasted-beef', 'top round roast', profile='stew',
                                      rub=['garlic powder', 'black pepper', 'thyme'], cook_minutes=60,
                                      notes='Roasted beef sliced thin for sandwiches or plates.'))
add('pot-roast', stew_recipe('Pot Roast', 'pot-roast', 'chuck roast, large pieces', veggies=['carrots', 'celery', 'onions'],
                             starch='baby potatoes', profile='stew', simmer=150, notes='Low-and-slow braise until fork-tender.'))
add('beef-stew', stew_recipe('Beef Stew', 'beef-stew', 'stew beef cubes', veggies=['carrots', 'celery', 'onions'],
                             starch='potatoes', profile='stew', simmer=110, notes='Classic beef stew with root vegetables.'))
add('beef-chili', make_recipe('Beef Chili', 'beef-chili', [
    {'quantity': '1.25', 'unit': 'lb', 'name': 'ground beef'},
    {'quantity': '1', 'unit': '', 'name': 'onion, diced'},
    {'quantity': '3', 'unit': 'cloves', 'name': 'garlic, minced'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'chili powder'},
    {'quantity': '1', 'unit': 'tablespoon', 'name': 'cumin'},
    {'quantity': '1', 'unit': 'can', 'name': 'diced tomatoes'},
    {'quantity': '1', 'unit': 'can', 'name': 'kidney beans, drained'}
], [
    'Brown beef with onion; drain excess fat.',
    'Stir in garlic, chili powder, and cumin until fragrant.',
    'Add tomatoes, beans, and 1 cup water; simmer 25-35 minutes.',
    'Adjust salt and serve with toppings.'
], 'chili', notes='Hearty ground beef chili with beans.', time_override={'prepMinutes': 15, 'cookMinutes': 40}))
add('meatloaf', make_recipe('Meatloaf', 'meatloaf', [
    {'quantity': '2', 'unit': 'lb', 'name': 'ground beef'},
    {'quantity': '1', 'unit': 'cup', 'name': 'breadcrumbs'},
    {'quantity': '2', 'unit': '', 'name': 'eggs'},
    {'quantity': '0.75', 'unit': 'cup', 'name': 'milk'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'ketchup'},
    {'quantity': '1', 'unit': '', 'name': 'small onion, minced'},
    {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'}
], [
    'Heat oven to 350F. Mix beef, breadcrumbs, eggs, milk, onion, and garlic until just combined.',
    'Shape into a loaf on a lined sheet; spread ketchup over the top.',
    'Bake 55-65 minutes until 160F internal.',
    'Rest 10 minutes before slicing.'
], 'stew', notes='Classic beef meatloaf with ketchup glaze.', time_override={'prepMinutes': 20, 'cookMinutes': 60}))
add('baked-meatballs', make_recipe('Baked Meatballs', 'baked-meatballs', [
    {'quantity': '1.5', 'unit': 'lb', 'name': 'ground beef/pork blend'},
    {'quantity': '0.75', 'unit': 'cup', 'name': 'breadcrumbs'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'grated parmesan'},
    {'quantity': '2', 'unit': '', 'name': 'eggs'},
    {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'chopped parsley'}
], [
    'Heat oven to 400F and line a sheet pan.',
    'Mix all ingredients until just combined; form 16 meatballs.',
    'Bake 18-22 minutes until browned and 165F internal.',
    'Serve with marinara or your favorite sauce.'
], 'sheet_pan', notes='Oven-baked meatballs for pasta, subs, or meal prep.', time_override={'prepMinutes': 15, 'cookMinutes': 20}))
add('sheet-pan-meatballs', recipes['baked-meatballs'])
add('baked-sausages-and-peppers', sheet_pan('Baked Sausages and Peppers', 'baked-sausages-and-peppers',
                                          'Italian sausages', veggies=['bell peppers', 'red onion'], seasoning='dried oregano',
                                          notes='Roasted sausage with sweet peppers and onions.'))
add('sheet-pan-italian-sausage', sheet_pan('Sheet Pan Italian Sausage', 'sheet-pan-italian-sausage',
                                         'Italian sausages', veggies=['broccoli', 'red onion'], seasoning='Italian seasoning',
                                         notes='Sausage and broccoli roast with Italian spices.'))
add('sheet-pan-steak-bites', sheet_pan('Sheet Pan Steak Bites', 'sheet-pan-steak-bites', 'sirloin steak chunks',
                                     veggies=['broccoli florets', 'red pepper'], seasoning='garlic powder',
                                     sauce='soy-butter drizzle', cook_minutes=18, notes='Quick roast steak bites with vegetables.'))
add('oven-roasted-sausages', baked_protein('Oven Roasted Sausages', 'oven-roasted-sausages', 'Italian sausages',
                                          profile='sheet_pan', rub=['fennel seed', 'black pepper'], cook_minutes=25,
                                          notes='Roast sausage links until browned and juicy.'))
add('hamburgers', make_recipe('Hamburgers', 'hamburgers', [
    {'quantity': '1.5', 'unit': 'lb', 'name': 'ground beef (80/20)'},
    {'quantity': '1.5', 'unit': 'teaspoons', 'name': 'kosher salt'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'black pepper'},
    {'quantity': '4', 'unit': '', 'name': 'burger buns'},
    {'quantity': '4', 'unit': 'slices', 'name': 'cheddar cheese'},
    {'quantity': '1', 'unit': 'cup', 'name': 'lettuce, tomato, pickle fixings'}
], [
    'Form beef into 4 patties without overworking; season with salt and pepper.',
    'Sear in a hot skillet or grill 3-4 minutes per side to desired doneness.',
    'Top with cheese to melt in the last minute.',
    'Rest briefly, then serve on toasted buns with fixings.'
], 'burger', notes='Juicy stovetop or grilled burgers with simple seasoning.', time_override={'prepMinutes': 12, 'cookMinutes': 12}))

# Seafood
add('baked-salmon', baked_protein('Baked Salmon', 'baked-salmon', 'salmon fillets', profile='seafood',
                                 rub=['garlic powder', 'paprika', 'lemon zest'], glaze='olive oil and lemon',
                                 cook_minutes=16, notes='Simple salmon with lemon and paprika.'))
add('baked-salmon-with-lemon', baked_protein('Baked Salmon with Lemon', 'baked-salmon-with-lemon', 'salmon fillets',
                                           profile='seafood', rub=['dill', 'garlic powder', 'lemon zest'], glaze='lemon butter',
                                           cook_minutes=16, notes='Lemony salmon finished with herb butter.'))
add('oven-roasted-salmon', baked_protein('Oven Roasted Salmon', 'oven-roasted-salmon', 'salmon fillets', profile='seafood',
                                       rub=['garlic powder', 'smoked paprika'], cook_minutes=14,
                                       notes='Roasted salmon with crisp edges.'))
add('baked-cod', baked_protein('Baked Cod', 'baked-cod', 'cod fillets', profile='seafood',
                              rub=['paprika', 'garlic powder', 'lemon zest'], cook_minutes=14,
                              notes='Flaky white fish with light seasoning.'))
add('baked-tilapia', baked_protein('Baked Tilapia', 'baked-tilapia', 'tilapia fillets', profile='seafood',
                                  rub=['garlic powder', 'cumin', 'paprika'], cook_minutes=12,
                                  notes='Mild fish with a quick spice rub.'))
add('baked-fish-sticks', make_recipe('Baked Fish Sticks', 'baked-fish-sticks', [
    {'quantity': '1.5', 'unit': 'lb', 'name': 'white fish, cut into strips'},
    {'quantity': '1', 'unit': 'cup', 'name': 'panko breadcrumbs'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'flour'},
    {'quantity': '2', 'unit': '', 'name': 'eggs, beaten'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'garlic powder'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'paprika'}
], [
    'Heat oven to 425F and line a sheet with parchment.',
    'Dredge fish in flour, dip in egg, then coat with seasoned panko.',
    'Arrange on sheet and spray lightly with oil.',
    'Bake 12-15 minutes until crisp and cooked through.'
], 'seafood', notes='Oven-crisp fish sticks without deep frying.', time_override={'prepMinutes': 20, 'cookMinutes': 14}))
add('garlic-butter-shrimp', make_recipe('Garlic Butter Shrimp', 'garlic-butter-shrimp', [
    {'quantity': '1.25', 'unit': 'lb', 'name': 'large shrimp, peeled'},
    {'quantity': '3', 'unit': 'tablespoons', 'name': 'butter'},
    {'quantity': '3', 'unit': 'cloves', 'name': 'garlic, minced'},
    {'quantity': '0.25', 'unit': 'teaspoon', 'name': 'red pepper flakes'},
    {'quantity': '0.5', 'unit': '', 'name': 'lemon, juiced'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'parsley, chopped'}
], [
    'Pat shrimp dry and season with salt and pepper.',
    'Melt butter in a skillet; add garlic until fragrant.',
    'Add shrimp and red pepper; cook 2-3 minutes per side until pink.',
    'Finish with lemon juice and parsley; serve immediately.'
], 'seafood', notes='Fast skillet shrimp with garlic-lemon butter.', time_override={'prepMinutes': 10, 'cookMinutes': 8}))
add('shrimp-scampi', make_recipe('Shrimp Scampi', 'shrimp-scampi', [
    {'quantity': '1.25', 'unit': 'lb', 'name': 'large shrimp, peeled'},
    {'quantity': '4', 'unit': 'tablespoons', 'name': 'butter'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'olive oil'},
    {'quantity': '4', 'unit': 'cloves', 'name': 'garlic, minced'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'dry white wine'},
    {'quantity': '0.5', 'unit': '', 'name': 'lemon, juiced'},
    {'quantity': '0.25', 'unit': 'cup', 'name': 'parsley, chopped'}
], [
    'Season shrimp with salt and pepper.',
    'Saute garlic in butter and oil until fragrant; add shrimp.',
    'Deglaze with wine and lemon; simmer briefly until shrimp are just opaque.',
    'Finish with parsley and serve over pasta or bread.'
], 'seafood', notes='Classic garlicky shrimp with wine and lemon.', time_override={'prepMinutes': 10, 'cookMinutes': 10}))
add('sheet-pan-shrimp', sheet_pan('Sheet Pan Shrimp', 'sheet-pan-shrimp', 'large shrimp', veggies=['broccoli', 'snap peas'],
                                 seasoning='garlic powder', sauce='lemon butter', cook_minutes=12,
                                 notes='Fast roast shrimp with crisp vegetables.'))

# Pasta and casseroles
add('baked-ziti', make_recipe('Baked Ziti', 'baked-ziti', [
    {'quantity': '1', 'unit': 'lb', 'name': 'ziti pasta'},
    {'quantity': '1', 'unit': 'lb', 'name': 'Italian sausage'},
    {'quantity': '3', 'unit': 'cups', 'name': 'marinara sauce'},
    {'quantity': '1.5', 'unit': 'cups', 'name': 'ricotta cheese'},
    {'quantity': '2', 'unit': 'cups', 'name': 'shredded mozzarella'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'grated parmesan'}
], [
    'Heat oven to 375F. Brown sausage; stir in marinara.',
    'Boil pasta until al dente; drain.',
    'Layer pasta with sauce, ricotta, and mozzarella in a baking dish.',
    'Top with cheese and bake 25-30 minutes until bubbling.'
], 'pasta_meaty', notes='Cheesy baked pasta with sausage and marinara.', time_override={'prepMinutes': 25, 'cookMinutes': 30}))
add('lasagna', make_recipe('Lasagna', 'lasagna', [
    {'quantity': '12', 'unit': '', 'name': 'lasagna noodles'},
    {'quantity': '1', 'unit': 'lb', 'name': 'ground beef'},
    {'quantity': '3', 'unit': 'cups', 'name': 'marinara sauce'},
    {'quantity': '15', 'unit': 'oz', 'name': 'ricotta cheese'},
    {'quantity': '3', 'unit': 'cups', 'name': 'shredded mozzarella'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'grated parmesan'}
], [
    'Heat oven to 375F. Brown beef; stir in marinara and simmer 10 minutes.',
    'Parboil noodles until flexible.',
    'Layer sauce, noodles, ricotta, and mozzarella; repeat.',
    'Top with cheese; bake 35-40 minutes until browned and bubbling.'
], 'pasta_meaty', notes='Layered beef lasagna with ricotta and mozzarella.', time_override={'prepMinutes': 25, 'cookMinutes': 40}))
add('mac-and-cheese', make_recipe('Mac and Cheese', 'mac-and-cheese', [
    {'quantity': '12', 'unit': 'oz', 'name': 'elbow macaroni'},
    {'quantity': '4', 'unit': 'tablespoons', 'name': 'butter'},
    {'quantity': '4', 'unit': 'tablespoons', 'name': 'flour'},
    {'quantity': '3', 'unit': 'cups', 'name': 'milk'},
    {'quantity': '3', 'unit': 'cups', 'name': 'shredded cheddar'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'mustard powder'}
], [
    'Boil pasta in salted water until al dente; drain.',
    'Make a roux with butter and flour; whisk in milk until thickened.',
    'Stir in cheese and mustard powder until smooth.',
    'Combine sauce with pasta and bake at 375F for 20 minutes if desired.'
], 'pasta_creamy', notes='Classic creamy macaroni and cheese.', time_override={'prepMinutes': 15, 'cookMinutes': 25}))
add('chicken-alfredo', make_recipe('Chicken Alfredo', 'chicken-alfredo', [
    {'quantity': '12', 'unit': 'oz', 'name': 'fettuccine'},
    {'quantity': '1', 'unit': 'lb', 'name': 'chicken breast, sliced'},
    {'quantity': '3', 'unit': 'tablespoons', 'name': 'butter'},
    {'quantity': '1', 'unit': 'cup', 'name': 'cream'},
    {'quantity': '1', 'unit': 'cup', 'name': 'grated parmesan'},
    {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'}
], [
    'Cook pasta in salted water until al dente.',
    'Sear chicken in butter until cooked; set aside.',
    'Add garlic, cream, and parmesan; simmer until slightly thick.',
    'Toss pasta and chicken in sauce; season and serve.'
], 'pasta_creamy', notes='Creamy parmesan sauce with seared chicken.', time_override={'prepMinutes': 15, 'cookMinutes': 20}))
add('spaghetti-and-meatballs', make_recipe('Spaghetti and Meatballs', 'spaghetti-and-meatballs', [
    {'quantity': '12', 'unit': 'oz', 'name': 'spaghetti'},
    {'quantity': '2', 'unit': 'cups', 'name': 'marinara sauce'},
    {'quantity': '12', 'unit': '', 'name': 'meatballs, cooked'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'grated parmesan'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'olive oil'}
], [
    'Boil spaghetti in salted water until al dente.',
    'Warm marinara and meatballs in a skillet with olive oil.',
    'Toss pasta with sauce and meatballs, adding pasta water as needed.',
    'Top with parmesan and serve hot.'
], 'pasta_meaty', notes='Classic spaghetti with marinara and meatballs.', time_override={'prepMinutes': 15, 'cookMinutes': 20}))
add('chicken-parmesan', make_recipe('Chicken Parmesan', 'chicken-parmesan', [
    {'quantity': '4', 'unit': '', 'name': 'chicken cutlets'},
    {'quantity': '1', 'unit': 'cup', 'name': 'breadcrumbs'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'grated parmesan'},
    {'quantity': '1', 'unit': '', 'name': 'egg, beaten'},
    {'quantity': '1.5', 'unit': 'cups', 'name': 'marinara sauce'},
    {'quantity': '1.5', 'unit': 'cups', 'name': 'mozzarella cheese'}
], [
    'Heat oven to 400F. Dredge cutlets in egg then breadcrumb-parmesan mix.',
    'Pan-sear in oil until golden on both sides.',
    'Top with marinara and mozzarella; bake 12-15 minutes until melted and 165F.',
    'Rest briefly and serve over pasta or greens.'
], 'pasta_meaty', notes='Crispy cutlets baked with sauce and cheese.', time_override={'prepMinutes': 20, 'cookMinutes': 25}))

# Soups and stews
add('chicken-noodle-soup', soup_recipe('Chicken Noodle Soup', 'chicken-noodle-soup', 'shredded cooked chicken', 'egg noodles',
                                      veggies=['peas'], profile='soup', simmer=25, notes='Classic broth soup with noodles and vegetables.'))
add('vegetable-soup', soup_recipe('Vegetable Soup', 'vegetable-soup', None, 'diced potatoes', veggies=['green beans', 'zucchini'],
                                 broth='vegetable broth', profile='soup', simmer=30, notes='Brothy vegetable-packed soup.'))
add('chicken-curry', stew_recipe('Chicken Curry', 'chicken-curry', 'boneless chicken thighs', veggies=['onions', 'bell peppers'],
                                starch='diced potatoes', profile='stew', simmer=45, notes='One-pot curry with tender chicken and vegetables.'))
add('chicken-tikka-masala', stew_recipe('Chicken Tikka Masala', 'chicken-tikka-masala', 'marinated chicken thighs', veggies=['onions'],
                                       starch=None, profile='stew', simmer=45, notes='Creamy tomato-spice sauce with tender chicken.'))
add('chicken-pot-pie', make_recipe('Chicken Pot Pie', 'chicken-pot-pie', [
    {'quantity': '2', 'unit': 'cups', 'name': 'cooked chicken, diced'},
    {'quantity': '2', 'unit': 'cups', 'name': 'mixed vegetables'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'butter'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'flour'},
    {'quantity': '2', 'unit': 'cups', 'name': 'chicken broth'},
    {'quantity': '1', 'unit': 'cup', 'name': 'milk'},
    {'quantity': '2', 'unit': '', 'name': 'pie crusts'}
], [
    'Heat oven to 400F. Make a roux with butter and flour; whisk in broth and milk until thick.',
    'Stir in chicken and vegetables; season well.',
    'Fill pie dish and top with crust; crimp and vent.',
    'Bake 35-40 minutes until golden and bubbling.'
], 'stew', notes='Comfort chicken pot pie with creamy filling.', time_override={'prepMinutes': 25, 'cookMinutes': 40}))
add('shepherds-pie', make_recipe("Shepherd's Pie", 'shepherds-pie', [
    {'quantity': '1.25', 'unit': 'lb', 'name': 'ground beef or lamb'},
    {'quantity': '1', 'unit': '', 'name': 'onion, diced'},
    {'quantity': '2', 'unit': 'cups', 'name': 'mixed vegetables'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'tomato paste'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'beef broth'},
    {'quantity': '4', 'unit': 'cups', 'name': 'mashed potatoes'}
], [
    'Brown meat with onion; drain fat if needed.',
    'Stir in vegetables and tomato paste; add broth and simmer until thick.',
    'Spread in a baking dish and top with mashed potatoes.',
    'Bake at 375F for 25-30 minutes until browned on top.'
], 'stew', notes='Mashed potato-topped casserole with savory filling.', time_override={'prepMinutes': 25, 'cookMinutes': 30}))
add('stuffed-peppers', make_recipe('Stuffed Peppers', 'stuffed-peppers', [
    {'quantity': '4', 'unit': '', 'name': 'bell peppers, tops removed'},
    {'quantity': '1', 'unit': 'lb', 'name': 'ground beef or turkey'},
    {'quantity': '1', 'unit': 'cup', 'name': 'cooked rice'},
    {'quantity': '1', 'unit': 'cup', 'name': 'tomato sauce'},
    {'quantity': '1', 'unit': 'cup', 'name': 'shredded cheese'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'Italian seasoning'}
], [
    'Heat oven to 375F. Brown meat with seasoning; stir in cooked rice and tomato sauce.',
    'Season to taste and spoon filling into peppers.',
    'Top with cheese and place in a baking dish with a splash of water.',
    'Cover and bake 30-35 minutes until peppers are tender.'
], 'stew', notes='Oven-baked peppers stuffed with saucy meat and rice.', time_override={'prepMinutes': 20, 'cookMinutes': 35}))
add('beef-burritos', taco_recipe('Beef Burritos', 'beef-burritos', 'ground beef', 'taco seasoning', extras=['black beans', 'rice'],
                                profile='taco', notes='Flour tortillas stuffed with beef, rice, and beans.'))
add('enchiladas', make_recipe('Enchiladas', 'enchiladas', [
    {'quantity': '2', 'unit': 'cups', 'name': 'shredded cooked chicken'},
    {'quantity': '8', 'unit': '', 'name': 'tortillas'},
    {'quantity': '2', 'unit': 'cups', 'name': 'enchilada sauce'},
    {'quantity': '1.5', 'unit': 'cups', 'name': 'shredded cheese'},
    {'quantity': '1', 'unit': 'cup', 'name': 'black beans'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'corn kernels'}
], [
    'Heat oven to 375F. Soften tortillas if needed.',
    'Mix chicken with some sauce, beans, and corn; roll into tortillas.',
    'Place seam-side down, cover with sauce and cheese.',
    'Bake 20-25 minutes until bubbly and melted.'
], 'taco', notes='Baked enchiladas with chicken and beans.', time_override={'prepMinutes': 20, 'cookMinutes': 25}))
add('tacos', taco_recipe('Tacos', 'tacos', 'ground beef', 'taco seasoning', extras=['pico de gallo'], profile='taco',
                       notes='Weeknight ground beef tacos with fresh toppings.'))
add('beef-tacos', taco_recipe('Beef Tacos', 'beef-tacos', 'ground beef', 'taco seasoning', extras=['pico de gallo'],
                             profile='taco', notes='Simple seasoned beef tacos.'))
add('quesadillas', make_recipe('Quesadillas', 'quesadillas', [
    {'quantity': '8', 'unit': '', 'name': 'flour tortillas'},
    {'quantity': '2', 'unit': 'cups', 'name': 'shredded cheese'},
    {'quantity': '2', 'unit': 'cups', 'name': 'cooked chicken or beans'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'oil for cooking'},
    {'quantity': '1', 'unit': 'cup', 'name': 'salsa or pico for serving'}
], [
    'Heat a large skillet with a little oil.',
    'Layer tortilla with cheese and filling; top with another tortilla.',
    'Cook 2-3 minutes per side until golden and cheese melts.',
    'Slice and serve with salsa.'
], 'taco', notes='Crisp skillet quesadillas with melty cheese.', time_override={'prepMinutes': 10, 'cookMinutes': 15}))
add('sheet-pan-chicken-fajitas', sheet_pan('Sheet Pan Chicken Fajitas', 'sheet-pan-chicken-fajitas', 'chicken strips',
                                         veggies=['bell peppers', 'red onion'], seasoning='fajita seasoning', cook_minutes=22,
                                         notes='Oven fajitas with peppers and onions.'))
add('sheet-pan-chicken-and-vegetables', sheet_pan('Sheet Pan Chicken and Vegetables', 'sheet-pan-chicken-and-vegetables',
                                                'chicken thighs', veggies=['broccoli', 'carrots'], seasoning='Italian seasoning',
                                                cook_minutes=28, notes='Balanced one-pan dinner with chicken and veg.'))
add('sheet-pan-garlic-chicken', sheet_pan('Sheet Pan Garlic Chicken', 'sheet-pan-garlic-chicken', 'chicken thighs',
                                        veggies=['green beans', 'potatoes'], seasoning='garlic-herb blend', cook_minutes=30,
                                        notes='Garlic-forward roasted chicken and potatoes.'))
add('sheet-pan-honey-chicken', sheet_pan('Sheet Pan Honey Chicken', 'sheet-pan-honey-chicken', 'chicken thighs',
                                       veggies=['carrots', 'broccoli'], seasoning='smoked paprika', sauce='honey-soy glaze',
                                       cook_minutes=28, notes='Sticky-sweet roasted chicken with vegetables.'))
add('sheet-pan-lemon-chicken', sheet_pan('Sheet Pan Lemon Chicken', 'sheet-pan-lemon-chicken', 'chicken thighs',
                                       veggies=['zucchini', 'red onion'], seasoning='lemon pepper', sauce='lemon herb dressing',
                                       cook_minutes=26, notes='Bright lemon-herb roast on one pan.'))
add('sheet-pan-italian-sausage', recipes['sheet-pan-italian-sausage'])
add('sheet-pan-pork-tenderloin', recipes['sheet-pan-pork-tenderloin'])
add('sheet-pan-steak-bites', recipes['sheet-pan-steak-bites'])
add('sheet-pan-pork-chops', recipes['sheet-pan-pork-chops'])
add('sheet-pan-shrimp', recipes['sheet-pan-shrimp'])

# Rice and sauces
add('fried-rice', rice_recipe('Fried Rice', 'fried-rice', add_ins=['scallions'], protein=None, notes='Classic takeout-style fried rice.'))
add('egg-fried-rice', rice_recipe('Egg Fried Rice', 'egg-fried-rice', add_ins=['scallions', 'peas'], protein=None, notes='Egg-forward fried rice with peas.'))
add('rice-and-beans', make_recipe('Rice and Beans', 'rice-and-beans', [
    {'quantity': '1', 'unit': 'cup', 'name': 'long-grain rice'},
    {'quantity': '1', 'unit': 'tablespoon', 'name': 'olive oil'},
    {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, minced'},
    {'quantity': '1', 'unit': 'can', 'name': 'black beans, rinsed'},
    {'quantity': '2', 'unit': 'cups', 'name': 'broth'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'cumin'}
], [
    'Saute garlic in oil until fragrant.',
    'Add rice and toast 1-2 minutes.',
    'Stir in beans, broth, cumin, and salt; bring to a simmer.',
    'Cover and cook 18 minutes until rice is tender; rest 5 minutes and fluff.'
], 'rice', notes='One-pot seasoned rice with black beans.', time_override={'prepMinutes': 10, 'cookMinutes': 20}))
add('pico-de-gallo', sauce_recipe('Pico de Gallo', 'pico-de-gallo', [
    {'quantity': '4', 'unit': '', 'name': 'ripe tomatoes, diced'},
    {'quantity': '0.5', 'unit': '', 'name': 'red onion, minced'},
    {'quantity': '1', 'unit': '', 'name': 'jalapeño, minced'},
    {'quantity': '0.25', 'unit': 'cup', 'name': 'cilantro, chopped'},
    {'quantity': '1', 'unit': '', 'name': 'lime, juiced'},
    {'quantity': '0.75', 'unit': 'teaspoon', 'name': 'kosher salt'}
], profile='sauce', notes='Fresh salsa for tacos and bowls.'))
add('simple-tomato-sauce', sauce_recipe('Simple Tomato Sauce', 'simple-tomato-sauce', [
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'olive oil'},
    {'quantity': '3', 'unit': 'cloves', 'name': 'garlic, sliced'},
    {'quantity': '1', 'unit': 'can', 'name': 'crushed tomatoes'},
    {'quantity': '0.5', 'unit': 'teaspoon', 'name': 'red pepper flakes'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'dried oregano'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'sugar (optional)'}
], profile='sauce', cook=True, notes='Pan-cooked tomato sauce for pasta or pizza.'))

# Breakfast
add('pancakes', make_recipe('Pancakes', 'pancakes', [
    {'quantity': '1.5', 'unit': 'cups', 'name': 'all-purpose flour'},
    {'quantity': '3.5', 'unit': 'teaspoons', 'name': 'baking powder'},
    {'quantity': '1', 'unit': 'tablespoon', 'name': 'sugar'},
    {'quantity': '1', 'unit': '', 'name': 'egg'},
    {'quantity': '1.25', 'unit': 'cups', 'name': 'milk'},
    {'quantity': '3', 'unit': 'tablespoons', 'name': 'melted butter'}
], [
    'Whisk dry ingredients together, then add egg, milk, and butter.',
    'Stir until just combined; some small lumps are fine.',
    'Cook 1/4-cup portions on a greased griddle until bubbles form; flip and cook to golden.',
    'Serve warm with syrup or fruit.'
], 'breakfast', notes='Fluffy griddle pancakes.'))
add('french-toast', make_recipe('French Toast', 'french-toast', [
    {'quantity': '8', 'unit': 'slices', 'name': 'sturdy bread'},
    {'quantity': '4', 'unit': '', 'name': 'eggs'},
    {'quantity': '1', 'unit': 'cup', 'name': 'milk'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'sugar'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'cinnamon'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'vanilla extract'}
], [
    'Whisk eggs, milk, sugar, cinnamon, and vanilla in a shallow dish.',
    'Dip bread to soak briefly on each side.',
    'Cook on a buttered skillet over medium heat until golden on both sides.',
    'Serve hot with syrup or berries.'
], 'breakfast', notes='Custardy skillet-fried toast.'))
add('omelette', make_recipe('Omelette', 'omelette', [
    {'quantity': '6', 'unit': '', 'name': 'eggs'},
    {'quantity': '2', 'unit': 'tablespoons', 'name': 'milk or cream'},
    {'quantity': '1', 'unit': 'tablespoon', 'name': 'butter'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'shredded cheese'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'cooked vegetables or ham'}
], [
    'Whisk eggs with milk and a pinch of salt.',
    'Melt butter in a nonstick skillet over medium-low heat.',
    'Pour eggs and gently stir until just set; add fillings and fold.',
    'Slide onto a plate and serve immediately.'
], 'breakfast', notes='Soft folded omelette with customizable fillings.', time_override={'prepMinutes': 10, 'cookMinutes': 8}))

# Sides and salad
add('mashed-potatoes', make_recipe('Mashed Potatoes', 'mashed-potatoes', [
    {'quantity': '2.5', 'unit': 'lb', 'name': 'russet potatoes, peeled'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'milk or cream'},
    {'quantity': '4', 'unit': 'tablespoons', 'name': 'butter'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'salt'},
    {'quantity': '0.5', 'unit': 'teaspoon', 'name': 'black pepper'},
    {'quantity': '2', 'unit': 'cloves', 'name': 'garlic, optional'}
], [
    'Boil potatoes in salted water until fork-tender.',
    'Drain well and mash with butter.',
    'Stir in warm milk/cream until smooth.',
    'Season with salt and pepper; add roasted garlic if desired.'
], 'side', notes='Creamy, fluffy mashed potatoes.'))
add('caesar-salad', make_recipe('Caesar Salad', 'caesar-salad', [
    {'quantity': '1', 'unit': 'large head', 'name': 'romaine lettuce, chopped'},
    {'quantity': '0.5', 'unit': 'cup', 'name': 'parmesan cheese, grated'},
    {'quantity': '1', 'unit': 'cup', 'name': 'croutons'},
    {'quantity': '1', 'unit': '', 'name': 'lemon, juiced'},
    {'quantity': '1', 'unit': 'teaspoon', 'name': 'dijon mustard'},
    {'quantity': '1', 'unit': 'clove', 'name': 'garlic, minced'},
    {'quantity': '0.25', 'unit': 'cup', 'name': 'olive oil'},
    {'quantity': '2', 'unit': 'fillets', 'name': 'anchovy, minced (optional)'}
], [
    'Whisk lemon juice, mustard, garlic, and anchovy with a pinch of salt.',
    'Slowly stream in olive oil to emulsify.',
    'Toss romaine with dressing, parmesan, and croutons.',
    'Serve immediately while crisp.'
], 'side', notes='Crisp romaine with tangy parmesan dressing.', time_override={'prepMinutes': 15, 'cookMinutes': 0}))
add('grilled-cheese', make_recipe('Grilled Cheese', 'grilled-cheese', [
    {'quantity': '8', 'unit': 'slices', 'name': 'bread'},
    {'quantity': '6', 'unit': 'tablespoons', 'name': 'butter, softened'},
    {'quantity': '2', 'unit': 'cups', 'name': 'shredded cheese mix'}
], [
    'Butter bread slices on one side.',
    'Place cheese between bread, buttered sides out.',
    'Cook in a skillet over medium heat until golden and melty, 2-3 minutes per side.',
    'Rest briefly, slice, and serve.'
], 'sandwich', notes='Crispy, melty grilled cheese sandwich.', time_override={'prepMinutes': 5, 'cookMinutes': 8}))

# Breakfast sweets and desserts
add('banana-bread', dessert_recipe('Banana Bread', 'banana-bread', 'banana_bread', 'dessert_bread'))
add('chocolate-chip-cookies', dessert_recipe('Chocolate Chip Cookies', 'chocolate-chip-cookies', 'cookies', 'dessert_cookie'))

# Misc basics
add('baked-bbq-chicken', recipes['baked-bbq-chicken'])
add('baked-buffalo-chicken', recipes['baked-buffalo-chicken'])
add('baked-teriyaki-chicken', recipes['baked-teriyaki-chicken'])
add('baked-greek-chicken', recipes['baked-greek-chicken'])
add('baked-salmon-with-lemon', recipes['baked-salmon-with-lemon'])
add('baked-salmon', recipes['baked-salmon'])
add('baked-cod', recipes['baked-cod'])
add('baked-tilapia', recipes['baked-tilapia'])
add('baked-fish-sticks', recipes['baked-fish-sticks'])
add('baked-ziti', recipes['baked-ziti'])
add('omelette', recipes['omelette'])
add('pancakes', recipes['pancakes'])
add('french-toast', recipes['french-toast'])
add('baked-ham-steak', recipes['baked-ham-steak'])
add('baked-meatballs', recipes['baked-meatballs'])
add('sheet-pan-meatballs', recipes['sheet-pan-meatballs'])
add('sheet-pan-italian-sausage', recipes['sheet-pan-italian-sausage'])
add('sheet-pan-pork-tenderloin', recipes['sheet-pan-pork-tenderloin'])
add('sheet-pan-steak-bites', recipes['sheet-pan-steak-bites'])
add('sheet-pan-pork-chops', recipes['sheet-pan-pork-chops'])
add('sheet-pan-shrimp', recipes['sheet-pan-shrimp'])
add('sheet-pan-chicken-and-vegetables', recipes['sheet-pan-chicken-and-vegetables'])
add('sheet-pan-garlic-chicken', recipes['sheet-pan-garlic-chicken'])
add('sheet-pan-honey-chicken', recipes['sheet-pan-honey-chicken'])
add('sheet-pan-lemon-chicken', recipes['sheet-pan-lemon-chicken'])
add('sheet-pan-chicken-fajitas', recipes['sheet-pan-chicken-fajitas'])
add('herb-roasted-pork-tenderloin', recipes['herb-roasted-pork-tenderloin'])
add('baked-sausages-and-peppers', recipes['baked-sausages-and-peppers'])
add('sheet-pan-italian-sausage', recipes['sheet-pan-italian-sausage'])

# Additional mains
add('baked-salmon-with-lemon', recipes['baked-salmon-with-lemon'])
add('baked-salmon', recipes['baked-salmon'])
add('oven-roasted-salmon', recipes['oven-roasted-salmon'])

# Tex-Mex rice/beans already included

# Validate coverage
with open(os.path.join(BASES[0], 'list.json'), 'r', encoding='utf-8') as f:
    expected = [item['slug'] for item in json.load(f)]

missing = [slug for slug in expected if slug not in recipes]
if missing:
    raise SystemExit(f'Missing recipes: {missing}')

for slug, data in recipes.items():
    for base in BASES:
        path = os.path.join(base, slug, 'recipe.json')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

print(f'Wrote {len(recipes)} recipes to {len(BASES)} base(s)')
