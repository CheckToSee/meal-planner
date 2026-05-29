import anthropic
import os


def generate_meal_plan(store_id: str, preferences: dict):
    
    client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

    dietary = ", ".join(preferences.get("dietary", ["none"]))
    cuisines = ", ".join(preferences.get("cuisines", ["any"]))
    allergies = ", ".join(preferences.get("allergies", ["none"]))
    budget = preferences.get("budget", 100)
    num_people = preferences.get("num_people", 2)
    kid_friendly = preferences.get("kid_friendly", False)
    num_of_kids = preferences.get("num_kids", ["none"])

    prompt = f"""You are a meal planning assistant. Generate a 7-day meal plan based on the following:

- Weekly budget: ${budget} for {num_people} people
- Dietary restrictions: {dietary}
- Allergies: {allergies}
- Cuisine preferences: {cuisines}
- Kid friendly: {kid_friendly}
- Number of Kids to plan for: {num_of_kids}

Return ONLY a raw JSON object in this exact structure, no explanation, extra text, and no code fences:

{{
  "days": [
    {{
      "day": "Monday",
      "breakfast": {{
        "name": "meal name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "estimated_cost": 0.00,
        "cooking_instructions": "brief instructions"
      }},
      "lunch": {{
        "name": "meal name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "estimated_cost": 0.00,
        "cooking_instructions": "brief instructions"
      }},
      "dinner": {{
        "name": "meal name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "estimated_cost": 0.00,
        "cooking_instructions": "brief instructions"
      }}
    }}
  ],
  "shopping_list": [
    {{
      "ingredient": "ingredient name",
      "quantity": "amount needed",
      "estimated_price": 0.00,
      "category": "produce/meat/dairy/pantry/frozen"
    }}
  ],
  "estimated_total": 0.00
}}

Make sure estimated_total stays within the ${budget} budget unless budget is unreasonable. If unreasonable, give the cheapest options.
"""

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=8096,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    import json
    response_text = next(block.text for block in message.content if block.type == "text")

    #Strips markdown code (such as "```")
    if response_text.startswith("```"):
        response_text = response_text.split("\n", 1)[1]
        response_text = response_text.rsplit("```", 1)[0]

    meal_plan = json.loads(response_text)
    return meal_plan

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    test_preferences = {
        "dietary": ["vegetarian"],
        "cuisines": ["italian"],
        "allergies": ["nuts"],
        "budget": 100,
        "num_people": 2,
        "kid_friendly": False,
        "num_of_kids": 0
    }

    result = generate_meal_plan("test_store", test_preferences)
    print(result)
