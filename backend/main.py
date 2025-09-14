from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware 
from fastapi import HTTPException 
from pydantic import BaseModel
from dotenv import load_dotenv
import os, io, torch
from PIL import Image
from google import genai
from google.genai import types
from model_def import create_model, inference_transform


class RequestData(BaseModel):
    contents: list


load_dotenv()
app = FastAPI()

user_age = None  # global variable

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


vite_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
app.mount("/assets", StaticFiles(directory=os.path.join(vite_dist, "assets")), name="assets")


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(vite_dist, "index.html"))


@app.get("/{full_path:path}")
async def spa(full_path: str):
    return FileResponse(os.path.join(vite_dist, "index.html"))
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = create_model()
model.load_state_dict(torch.load("age_prediction_resnet34.pth", map_location=device))
model.to(device)
model.eval()


@app.post("/predict_age")
async def predict_age(file: UploadFile = File(...)):
    global user_age
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    tensor = inference_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tensor)
        predicted_age = output.item()
    
    user_age = round(predicted_age)
    print("predicted age: ", user_age)
    return {"predicted_age": user_age}


@app.post("/api/llm")
async def llm_endpoint(request: RequestData):
    global user_age
    try:
        user_query = request.contents[0]["parts"][0]["text"]

        if user_age is None:
            raise HTTPException(status_code=400, detail="User age not set. Please predict age first.")

        client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        print(f"User Age: {user_age}")
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1024,
                top_p=0.95,
                top_k=40,
                stop_sequences=["\n"],
                system_instruction=f"""You are a helpful assistant that helps people find information.
                                    you should answer the question based on the user's age which is {user_age}
                                    and your response should be relevant to the user's age which is always {user_age},
                                    when user queries for information that is not relevant to the user's age which is always {user_age},
                                    you should politely refuse to answer. Also,
                                    you should not response any harmful contents and
                                    restrict yourself when user queries for harmful contents
                                    and be polite and responses should be respect the human ethics 
                                    and moral.""",
            ),
            contents=f"{user_query}"
        )

        print(f"LLM Response: {response.text}")

        return {"response": response.text}

    except Exception as e:
        print(f"HTTP Exception: {e}")
        return HTTPException(status_code=500, detail=str(e))