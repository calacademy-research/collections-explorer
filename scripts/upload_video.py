import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from both .env and .env.local
load_dotenv()
load_dotenv('.env.local')

def main():
    # Get Convex URL from environment
    convex_url = os.getenv('NEXT_PUBLIC_CONVEX_URL')
    if not convex_url:
        print("Error: NEXT_PUBLIC_CONVEX_URL not found in environment variables")
        print("Please make sure it exists in .env.local")
        exit(1)

    # Construct the mutation URL (using the correct API endpoint)
    mutation_url = f"{convex_url}/api/mutation"

    # Path to the video file
    video_path = Path('public/videos/nature-background.mp4')
    if not video_path.exists():
        print(f"Error: Video file not found at {video_path}")
        exit(1)

    try:
        print("Getting upload URL from Convex...")
        # First, get the upload URL from Convex
        response = requests.post(
            mutation_url,
            json={
                "path": "videos:generateUploadUrl",
                "args": {}
            }
        )
        response.raise_for_status()
        response_data = response.json()
        
        if not isinstance(response_data, dict) or 'value' not in response_data:
            print("Unexpected response format:", response_data)
            exit(1)
            
        upload_url = response_data['value']
        print("Got upload URL")

        print("Uploading video...")
        # Now upload the video
        with open(video_path, 'rb') as video_file:
            upload_response = requests.post(
                upload_url,
                headers={'Content-Type': 'video/mp4'},
                data=video_file
            )
            upload_response.raise_for_status()
            result = upload_response.json()

        # Save the storage ID
        storage_id = result['storageId']
        print("Video uploaded successfully!")
        print(f"Storage ID: {storage_id}")

        # Save the storage ID to a file
        with open('video-storage-id.txt', 'w') as f:
            f.write(storage_id)

    except requests.exceptions.RequestException as e:
        print(f"Error during upload: {e}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print("Response:", e.response.text)
        exit(1)
    except KeyError as e:
        print(f"Unexpected response format: {e}")
        exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        exit(1)

if __name__ == '__main__':
    main() 