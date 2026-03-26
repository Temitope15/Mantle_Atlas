import requests

def test_defillama():
    urls = [
        "https://api.llama.fi/protocols",
        "https://api.llama.fi/lite/protocols2",
        "https://yields.llama.fi/pools"
    ]
    for url in urls:
        print(f"Testing {url}...")
        try:
            response = requests.get(url, timeout=10)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Success! Length: {len(response.text)}")
            else:
                print(f"Failed. Content: {response.text[:100]}")
        except Exception as e:
            print(f"Error: {e}")
        print("-" * 20)

if __name__ == "__main__":
    test_defillama()
