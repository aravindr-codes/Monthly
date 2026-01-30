import os
from pymongo import MongoClient

CATEGORIES = [
    "Mortgage",
    "Car",
    "Insurance",
    "Groceries",
    "Snacks",
    "House repair and Cleaning",
    "Electricity",
    "Water",
    "Sewer",
    "House tax",
    "Karate",
    "Swim",
    "Football",
    "Takeout",
    "Telephone",
    "Entertainment",
    "Fuel",
    "MSC(Books and Gifts)",
    "Utilities gas",
    "Amazon",
    "Ring yearly",
    "Internet",
    "Subscription channels",
    "Dance",
    "Music",
    "Clothes",    
    "Retail",
    "medicine",
    "RSM",
    "Invest",
    "Pets",
]


def build_mongo_uri() -> str:
    uri = os.getenv("MONGO_URI")
    if uri:
        return uri

    host = os.getenv("MONGO_HOST", "localhost")
    port = os.getenv("MONGO_PORT", "27017")
    db_name = os.getenv("MONGO_DB", "BUDGET-DB")
    user = os.getenv("MONGO_USER", "dbadmin")
    password = os.getenv("MONGO_PASSWORD", "secret")
    auth_source = os.getenv("MONGO_AUTH_SOURCE", "admin")

    if user and password:
        return f"mongodb://{user}:{password}@{host}:{port}/{db_name}?authSource={auth_source}"

    return f"mongodb://{host}:{port}/{db_name}"


def main() -> int:
    uri = build_mongo_uri()
    db_name = os.getenv("MONGO_DB", "BUDGET-DB")
    collection_name = os.getenv("MONGO_CATEGORY_COLLECTION", "Category")

    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    inserted = 0
    existed = 0

    for name in CATEGORIES:
        result = collection.update_one(
            {"Name": name},
            {"$setOnInsert": {"Name": name}},
            upsert=True,
        )
        if result.upserted_id is not None:
            inserted += 1
        else:
            existed += 1

    print(f"Inserted: {inserted}")
    print(f"Already existed: {existed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
