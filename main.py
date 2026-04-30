from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI(title="Qanat Global Solutions")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/services", response_class=HTMLResponse)
async def services(request: Request):
    return templates.TemplateResponse("services.html", {"request": request})


@app.get("/industries", response_class=HTMLResponse)
async def industries(request: Request):
    return templates.TemplateResponse("industries.html", {"request": request})


@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})


@app.post("/api/contact")
async def submit_contact(
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(""),
    service: str = Form(""),
    message: str = Form(...),
):
    # Here you'd integrate with email/CRM
    print(f"New inquiry from {name} <{email}> — {service}")
    return JSONResponse({"status": "success", "message": "Thank you! We'll be in touch within 24 hours."})


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
