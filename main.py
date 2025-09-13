from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  
import os, io, torch
from PIL import Image
from model_def import create_model, inference_transform

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  
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
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    tensor = inference_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tensor)
        predicted_age = output.item()
    return {"predicted_age": round(predicted_age, 2)}
