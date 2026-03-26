import requests
import json

def debug_protocols():
    url = "https://defillama-datasets.llama.fi/lite/v2/protocols"
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Data type: {type(data)}")
            if isinstance(data, list):
                print(f"List length: {len(data)}")
                if len(data) > 0:
                    print("First item sample:")
                    print(json.dumps(data[0], indent=2))
            elif isinstance(data, dict):
                print(f"Keys: {data.keys()}")
                for key in data.keys():
                    if isinstance(data[key], list):
                        print(f"Key '{key}' is a list of length {len(data[key])}")
                        if len(data[key]) > 0:
                            print(f"First item in '{key}':")
                            print(json.dumps(data[key][0], indent=2))
        else:
            print(f"Failed. Content: {response.text[:100]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_protocols()
