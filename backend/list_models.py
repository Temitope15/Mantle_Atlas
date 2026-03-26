from google import genai
from config import settings

client = genai.Client(api_key=settings.gemini_api_key)
for model in client.models.list():
    print(model.name)
