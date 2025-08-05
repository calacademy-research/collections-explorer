#!/usr/bin/env python3
import json
import requests
import time
from pathlib import Path

# Configuration
BACKEND_URL = "http://127.0.0.1:3210"
ADMIN_KEY = "convex-self-hosted|0120c2dc8ec6c9669efcc34d7005d0918a708898f22827d812026a917684f8e19990a1bd5c"
BOTANY_FILE = "backup_extract/botany/documents.jsonl"
BATCH_SIZE = 100

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ADMIN_KEY}"
}

def import_botany_data():
    """Import botany data from backup into self-hosted Convex"""
    print("Starting botany data import...")
    
    # Read the botany data file
    with open(BOTANY_FILE, 'r') as f:
        lines = f.readlines()
    
    total_records = len(lines)
    print(f"Found {total_records} botany records to import")
    
    # Process in batches
    for i in range(0, total_records, BATCH_SIZE):
        batch = lines[i:i + BATCH_SIZE]
        batch_data = []
        
        for line in batch:
            try:
                record = json.loads(line.strip())
                batch_data.append(record)
            except json.JSONDecodeError as e:
                print(f"Error parsing line: {e}")
                continue
        
        if batch_data:
            # Insert batch
            payload = {
                "tableName": "botany",
                "documents": batch_data
            }
            
            try:
                response = requests.post(
                    f"{BACKEND_URL}/api/admin/insert",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    print(f"Imported batch {i//BATCH_SIZE + 1}/{(total_records + BATCH_SIZE - 1)//BATCH_SIZE} ({len(batch_data)} records)")
                else:
                    print(f"Error importing batch {i//BATCH_SIZE + 1}: {response.status_code} - {response.text}")
                    
            except Exception as e:
                print(f"Error importing batch {i//BATCH_SIZE + 1}: {e}")
            
            # Small delay to avoid overwhelming the server
            time.sleep(0.1)
    
    print("Botany data import completed!")

if __name__ == "__main__":
    import_botany_data() 