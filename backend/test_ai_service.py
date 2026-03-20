import sys
import os

# Ensure backend acts as module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.ai_service import generate_defi_strategy

def run():
    print("Testing generate_defi_strategy...")
    try:
        data = generate_defi_strategy()
        print("\nSUCCESS! Output:")
        print(data)
    except Exception as e:
        print("\nERROR:")
        print(e)

if __name__ == "__main__":
    run()
