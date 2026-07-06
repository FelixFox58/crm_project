#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error
from datetime import datetime

NOTION_TOKEN = os.environ.get("NOTION_TOKEN")
NOTION_DATABASE_ID = os.environ.get("NOTION_DATABASE_ID")

def extract_property_value(prop):
    if not prop:
        return ""
    prop_type = prop.get("type")
    
    if prop_type == "title":
        return "".join([t.get("plain_text", "") for t in prop.get("title", [])])
    elif prop_type == "rich_text":
        return "".join([t.get("plain_text", "") for t in prop.get("rich_text", [])])
    elif prop_type == "select":
        sel = prop.get("select")
        return sel.get("name", "") if sel else ""
    elif prop_type == "multi_select":
        return ", ".join([s.get("name", "") for s in prop.get("multi_select", [])])
    elif prop_type == "number":
        val = prop.get("number")
        # Keep format consistent (don't add .0 if integer)
        if val is not None:
            if val == int(val):
                return str(int(val))
            return str(val)
        return ""
    elif prop_type == "date":
        d = prop.get("date")
        if not d:
            return ""
        start = d.get("start", "")
        # If time is present, Notion sends it like '2026-07-05T18:15:00.000Z'
        # Let's clean the 'T' and milliseconds if possible to keep it readable,
        # or output it as is since our new date parser can handle ISO formats.
        if start and "T" in start:
            # e.g., '2026-07-05T18:15:00.000Z' -> '2026-07-05 18:15:00'
            start = start.replace("T", " ").split(".")[0].replace("Z", "")
        return start
    elif prop_type == "people":
        return ", ".join([p.get("name", p.get("id", "")) for p in prop.get("people", [])])
    elif prop_type == "url":
        return prop.get("url", "") or ""
    elif prop_type == "status":
        status = prop.get("status")
        return status.get("name", "") if status else ""
    elif prop_type == "checkbox":
        return "true" if prop.get("checkbox") else "false"
    elif prop_type == "files":
        files_list = prop.get("files", [])
        urls = []
        for f in files_list:
            file_type = f.get("type")
            if file_type == "file":
                urls.append(f.get("file", {}).get("url", ""))
            elif file_type == "external":
                urls.append(f.get("external", {}).get("url", ""))
        return ", ".join([u for u in urls if u])
    elif prop_type == "formula":
        formula = prop.get("formula", {})
        ftype = formula.get("type")
        if ftype == "string":
            return formula.get("string", "") or ""
        elif ftype == "number":
            val = formula.get("number")
            if val is not None:
                if val == int(val):
                    return str(int(val))
                return str(val)
            return ""
        elif ftype == "boolean":
            return "true" if formula.get("boolean") else "false"
        elif ftype == "date":
            fdate = formula.get("date", {})
            if fdate:
                start = fdate.get("start", "")
                if start and "T" in start:
                    start = start.replace("T", " ").split(".")[0].replace("Z", "")
                return start
            return ""
    return ""

def fetch_notion_pages():
    token = (NOTION_TOKEN or "").strip()
    db_id = (NOTION_DATABASE_ID or "").strip()
    
    # Extract ID from full URL if pasted
    if "?" in db_id:
        db_id = db_id.split("?")[0]
    if "/" in db_id:
        db_id = db_id.split("/")[-1]
    db_id = db_id.replace("-", "")

    if not token or not db_id:
        raise ValueError("NOTION_TOKEN and NOTION_DATABASE_ID environment variables must be set.")

    url = f"https://api.notion.com/v1/databases/{db_id}/query"
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }

    all_results = []
    has_more = True
    next_cursor = None

    print(f"Fetching data from Notion database {NOTION_DATABASE_ID}...")

    while has_more:
        payload = {}
        if next_cursor:
            payload["start_cursor"] = next_cursor

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode("utf-8"))
                results = data.get("results", [])
                all_results.extend(results)
                print(f"Fetched {len(results)} items (Total: {len(all_results)})")
                
                has_more = data.get("has_more", False)
                next_cursor = data.get("next_cursor")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            print(f"HTTP Error {e.code}: {e.reason}")
            print(f"Details: {error_body}")
            raise e

    return all_results

def map_notion_pages_to_rows(pages):
    keys = [
        "Таска", "Files & media", "GEO", "Id", "Post", "Text", "link", "Баєр", 
        "Дата взяття в роботу", "Дата видачі", "Дата створення", 
        "Дизайнер", "К-сть", "Креатив", "Мова", "Пріорітет", 
        "Розмір", "Статус таски", "Тип креатива:"
    ]

    mapped_rows = []
    for page in pages:
        properties = page.get("properties", {})
        row = {}
        
        for key in keys:
            # 1. Exact match
            prop = properties.get(key)
            
            # 2. Match without trailing colon if applicable
            if not prop and key.endswith(":"):
                prop = properties.get(key[:-1])
                
            # 3. Case-insensitive fallback
            if not prop:
                key_clean = key.lower().replace(":", "").strip()
                for prop_name in properties.keys():
                    prop_name_clean = prop_name.lower().replace(":", "").strip()
                    if prop_name_clean == key_clean:
                        prop = properties[prop_name]
                        break
            
            row[key] = extract_property_value(prop) if prop else ""
            
        mapped_rows.append(row)
        
    return mapped_rows

def main():
    try:
        pages = fetch_notion_pages()
        rows = map_notion_pages_to_rows(pages)
        
        # Sort rows by 'Id' or 'Дата створення' (ascending or descending) if possible
        # Default: sort by 'Id' numerically or alphabetically to keep output stable
        def get_id_key(r):
            # Extract number from ID like 'TS-47'
            raw_id = str(r.get("Id") or "").strip()
            if not raw_id:
                return (1, "")
            try:
                if "-" in raw_id:
                    return (0, int(raw_id.split("-")[1]))
                return (0, int(raw_id))
            except ValueError:
                return (1, raw_id)
        
        rows.sort(key=get_id_key)

        snapshot = {
            "version": 1,
            "generatedAt": datetime.utcnow().isoformat() + "Z",
            "rowCount": len(rows),
            "note": "Automatically synchronized with Notion database via GitHub Actions sync script.",
            "rows": rows
        }

        # Write to assets/latest-data.json
        output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "latest-data.json")

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(snapshot, f, ensure_ascii=False, indent=2)

        print(f"Success! Saved snapshot with {len(rows)} rows to {output_path}")

    except Exception as e:
        print(f"Error during Notion sync: {e}")
        exit(1)

if __name__ == "__main__":
    main()
