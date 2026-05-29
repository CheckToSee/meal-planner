import httpx
import os
import base64

KROGER_BASE_URL = "https://api.kroger.com/v1"

def get_access_token():
    client_id = os.getenv("KROGER_CLIENT_ID")
    client_secret = os.getenv("KROGER_CLIENT_SECRET")

    # Kroger needs base64 of the form: "client_id:client_secret"
    credentials = f"{client_id}:{client_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    response = httpx.post(
        f"{KROGER_BASE_URL}/connect/oauth2/token",
        headers={
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "client_credentials",
            "scope": "product.compact",
        }
    )

    response.raise_for_status()
    return response.json()["access_token"]

def find_nearby_stores(zip_code: str):
    token = get_access_token()

    response = httpx.get(
        f"{KROGER_BASE_URL}/locations",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.zipCode.near": zip_code,
            "filter.radiusInMiles": 10,
            "filter.limit": 10,
        }
    )

    # Checks to see if response fails, without it the function would return nothing
    response.raise_for_status()
    locations = response.json()["data"]

    return [
        {
            "id": store["locationId"],
            "name": store["name"],
            "address": store["address"]["addressLine1"],
            "city": store["address"]["city"],
            "zip": store["address"]["zipCode"],
        }
        for store in locations
    ]

def search_products(store_id: str, query: str):
    token = get_access_token()

    response = httpx.get(
        f"{KROGER_BASE_URL}/products",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "filter.locationId": store_id,
            "filter.term": query,
            "filter.limit": 5,
        }
    )

    # Checks to see if response fails, without it the function would return nothing
    response.raise_for_status()
    products = response.json()["data"]

    return [
        {
            "name": item["description"],
            "price": item.get("items", [{}])[0].get("price", {}).get("regular", None),
            "in_stock": item.get("items", [{}])[0].get("fulfillment", {}).get("inStore", False),
        }
        for item in products
    ]

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    stores = find_nearby_stores("20852")
    print(stores)
