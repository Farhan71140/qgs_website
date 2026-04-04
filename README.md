# Qanat Global Solutions — Website

A full-featured FastAPI website for QGS.

## Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the development server
python main.py
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit: http://localhost:8000

## Pages

| URL           | Page         |
|---------------|--------------|
| /             | Homepage     |
| /services     | Services     |
| /industries   | Industries   |
| /about        | About Us     |
| /contact      | Contact      |

## API Endpoints

| Method | URL           | Description            |
|--------|---------------|------------------------|
| POST   | /api/contact  | Contact form submission |

## Project Structure

```
qgs_website/
├── main.py              # FastAPI app
├── requirements.txt
├── templates/
│   ├── base.html        # Shared layout (nav, footer)
│   ├── index.html       # Homepage
│   ├── services.html    # Services page
│   ├── industries.html  # Industries page
│   ├── about.html       # About page
│   └── contact.html     # Contact page
└── static/
    ├── style.css        # All styles
    └── main.js          # Scroll, animations, form
```

## Customisation

- **Colors**: Edit CSS variables at top of `static/style.css`
- **Contact form**: Integrate your CRM/email in the `/api/contact` route in `main.py`
- **Logo**: Replace `QGS` text with an `<img>` tag in `templates/base.html`

## Production Deployment

```bash
uvicorn main:app --host 0.0.0.0 --port 80 --workers 4
```

Or deploy via Gunicorn:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Contact

- Email: contactus@qanatcs.in
- Phone: +91 92814 15851
- Web: https://qanatcs.in
