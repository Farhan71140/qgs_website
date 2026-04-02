from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = FastAPI(title="Qanat Global Solutions")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ── EMAIL SETTINGS ── fill these in ──
GMAIL_ADDRESS  = "your_gmail@gmail.com"   # Gmail you send FROM
GMAIL_PASSWORD = "xxxx xxxx xxxx xxxx"    # Gmail App Password (see steps below)
NOTIFY_EMAIL   = "contactus@qanatcs.in"   # Email you receive leads AT
# ─────────────────────────────────────


def send_email_notification(name, email, company, phone, service, budget, message):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Enquiry from {name} — QGS Website"
        msg["From"]    = GMAIL_ADDRESS
        msg["To"]      = NOTIFY_EMAIL

        html = f"""
        <html>
        <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">
          <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <div style="background:#1560FF;padding:28px 36px;">
              <h2 style="color:white;margin:0;font-size:20px;">New Lead from QGS Website</h2>
              <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Submitted via qanatcs.in contact form</p>
            </div>
            <div style="padding:32px 36px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;width:35%;color:#888;font-size:13px;">Full Name</td><td style="padding:12px 0;border-bottom:1px solid #eee;font-weight:600;color:#111;">{name}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Email</td><td style="padding:12px 0;border-bottom:1px solid #eee;"><a href="mailto:{email}" style="color:#1560FF;">{email}</a></td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Company</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;">{company or "—"}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;">{phone or "—"}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Service</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;">{service or "—"}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Budget</td><td style="padding:12px 0;border-bottom:1px solid #eee;color:#111;">{budget or "—"}</td></tr>
                <tr><td style="padding:12px 0;color:#888;font-size:13px;vertical-align:top;padding-top:16px;">Message</td><td style="padding:12px 0;color:#111;padding-top:16px;">{message}</td></tr>
              </table>
            </div>
            <div style="background:#f8f8f8;padding:20px 36px;text-align:center;">
              <p style="color:#aaa;font-size:12px;margin:0;">Qanat Global Solutions — qanatcs.in</p>
            </div>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_PASSWORD)
            server.sendmail(GMAIL_ADDRESS, NOTIFY_EMAIL, msg.as_string())

        print(f"Email sent for enquiry from {name} <{email}>")
        return True

    except Exception as e:
        print(f"Email failed: {e}")
        return False


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
    name:    str = Form(...),
    email:   str = Form(...),
    company: str = Form(""),
    phone:   str = Form(""),
    service: str = Form(""),
    budget:  str = Form(""),
    message: str = Form(...),
):
    sent = send_email_notification(name, email, company, phone, service, budget, message)
    return JSONResponse({
        "status": "success",
        "message": "Thank you! We'll be in touch within 24 hours."
    })


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
