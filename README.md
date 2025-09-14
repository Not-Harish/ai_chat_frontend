# Model Setup Guide

## Prerequisites
- Node.js installed on your system
- Python installed on your system
- pip package manager

## Installation Steps

### Step 1: Install Python Dependencies
```bash
pip install fastapi uvicorn torch
```
### Step 2: Setup Frontend
Navigate to the frontend directory and run:
```bash
npm i
npm install firebase
npm run build
```
### Step 3: Run the Application
Start the local development server with:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
### Accessing the Application
After running the above command, open your browser and navigate to: http://localhost:8000
