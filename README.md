# NyayaBharat 🇮🇳

> AI-powered legal assistance platform for Indian citizens — file complaints, understand legal notices, and know your rights, all in your native language.

---

## What is NyayaBharat?

NyayaBharat bridges the gap between Indian citizens and the legal system. Most government complaint systems are complex, English-only, and inaccessible to millions. NyayaBharat solves this with AI — letting anyone file complaints via voice, understand legal documents, and get instant answers about their rights in 13 Indian languages.

---

## Features

### 🤖 Rights Chatbot
Ask any legal question in your language and get answers backed by the Indian Constitution, IPC, and BNS. Powered by Amazon Bedrock Knowledge Base + Nova Lite.

### 🔍 Legal Lens
Upload a photo of any legal notice or document. AI reads, simplifies, and explains it — with key points, action items, and deadlines — in your native language.

### 🎤 Voice Complaint Filing
Record a voice note describing your issue. AI transcribes it, drafts a formal complaint, and notifies the relevant authorities automatically.

### 👮 Officer Mode
Government officials can upload handwritten petitions and get them converted into formal government documents instantly — in any of 13 languages.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + React Router |
| Backend | FastAPI (Python) |
| AI Model | Amazon Nova Lite (`amazon.nova-lite-v1:0`) |
| Knowledge Base | Amazon Bedrock Agent Runtime |
| Cloud | AWS (Bedrock, S3) |

---

## Project Structure

```
NyayaBharat/
├── app.py                  # FastAPI backend — all routes
├── legal_lens.py           # Legal Lens: Nova vision + Indian language output
├── officer_mode.py         # Officer Mode: handwriting → formal document
├── services/
│   ├── rights_chatbot.py   # RAG over Indian legal knowledge base
│   └── voice_complaint.py  # Voice transcription + complaint drafting
├── src/
│   ├── App.jsx             # React router + navbar
│   ├── api/
│   │   ├── api.js          # Axios base instance
│   │   ├── rightsApi.js
│   │   ├── legalLensApi.js
│   │   ├── voiceApi.js
│   │   └── officerApi.js
│   └── components/
│       ├── Landing.jsx
│       ├── RightsBot.jsx
│       ├── LegalLens.jsx
│       ├── OfficerMode.jsx
│       └── VoiceFiling.jsx
├── .env                    # Secret keys (never commit)
├── .env.example            # Template for env setup
├── .gitignore
└── requirements.txt
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- AWS account with Bedrock access enabled
- Amazon Nova Lite model enabled in AWS Bedrock console (`us-east-1`)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/NyayaBharat.git
cd NyayaBharat
```

### 2. Backend setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in `.env`:

```
AWS_KB_ID=your-knowledge-base-id
AWS_REGION=us-east-1
WHATSAPP_VERIFY_TOKEN=nyayabharat
```

Start the backend:

```bash
uvicorn app:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 3. Frontend setup

```bash
npm install
npm install react-router-dom@6
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check + service status |
| `POST` | `/api/rights/query` | Ask a legal question |
| `POST` | `/api/voice/complaint` | File a voice complaint |
| `POST` | `/api/legal-lens/analyze` | Analyze a legal document image |
| `GET` | `/api/officer/departments` | List government departments |
| `POST` | `/api/officer/scan-petition` | Convert handwritten petition to formal doc |

### Example: Rights Chatbot

```bash
curl -X POST http://localhost:8000/api/rights/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Can police arrest without a warrant?", "language": "hi"}'
```

### Example: Legal Lens

```bash
curl -X POST http://localhost:8000/api/legal-lens/analyze \
  -F "image=@notice.png" \
  -F "language=hi"
```

---

## Supported Languages

| Code | Language |
|------|----------|
| `hi` | Hindi |
| `bn` | Bengali |
| `te` | Telugu |
| `mr` | Marathi |
| `ta` | Tamil |
| `gu` | Gujarati |
| `kn` | Kannada |
| `ml` | Malayalam |
| `pa` | Punjabi |
| `or` | Odia |
| `as` | Assamese |
| `ur` | Urdu |
| `en` | English |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_KB_ID` | ✅ | Amazon Bedrock Knowledge Base ID |
| `AWS_REGION` | ✅ | AWS region (default: `us-east-1`) |
| `WHATSAPP_VERIFY_TOKEN` | ⬜ | Token for WhatsApp webhook verification |

AWS credentials must be configured via `~/.aws/credentials` or environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).

---

## Roadmap

- [x] Rights Chatbot with RAG
- [x] Legal Lens (image → simplified explanation)
- [x] Voice Complaint Filing
- [x] Officer Mode (handwriting → formal document)
- [x] 13 Indian language support
- [ ] WhatsApp integration
- [ ] Native language handwriting support in Officer Mode
- [ ] Complaint tracking dashboard
- [ ] Mobile app

---

## License

MIT License. See `LICENSE` for details.