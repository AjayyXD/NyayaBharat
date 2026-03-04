import boto3
import json
import base64

bedrock = boto3.client(service_name='bedrock-runtime', region_name='us-east-1')

# Supported Indian languages: ISO 639-1 code -> full name
INDIAN_LANGUAGES = {
    "hi": "Hindi",
    "bn": "Bengali",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "or": "Odia",
    "as": "Assamese",
    "ur": "Urdu",
    "en": "English",
}


def legal_lens_with_nova(image_bytes: bytes, language_code: str = "hi", content_type: str = "image/jpeg") -> dict:
    """
    Analyze a legal document image using Amazon Nova Lite.
    Accepts raw image bytes (not a file path) for FastAPI compatibility.
    Returns a structured analysis in the requested Indian language.
    """
    language_name = INDIAN_LANGUAGES.get(language_code, "Hindi")

    # Map MIME type to Nova-supported format string
    FORMAT_MAP = {
        "image/jpeg": "jpeg",
        "image/jpg":  "jpeg",
        "image/png":  "png",
        "image/webp": "webp",
        "image/gif":  "gif",
    }
    image_format = FORMAT_MAP.get(content_type, "jpeg")

    prompt = f"""You are a legal assistant helping common people in India understand legal notices.

Analyze the legal document/notice in the image and respond ENTIRELY in {language_name} language.

Your response must follow this exact structure:

**सारांश / Summary:**
[2-3 sentence plain-language summary of what this document is about]

**मुख्य बातें / Key Points:**
1. [Important point 1]
2. [Important point 2]
3. [Important point 3]

**आवश्यक कदम / Action Items:**
1. [What the person must do first, with any deadline]
2. [Second action to take]
3. [Third action — e.g. consult a lawyer if needed]

**समय सीमा / Deadlines:**
[List any dates or deadlines mentioned, or state "कोई स्पष्ट समय सीमा नहीं" if none found]

Use simple, everyday {language_name} that a common person can understand. Avoid legal jargon.
If the document is not clearly visible or readable, say so clearly in {language_name}."""

    # Correct Nova Lite request format (NOT the Anthropic/Claude format)
    body = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "image": {
                            "format": image_format,
                            "source": {
                                "bytes": base64.b64encode(image_bytes).decode("utf-8")
                            }
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "inferenceConfig": {
            "max_new_tokens": 1024,
            "temperature": 0.3
        }
    })

    response = bedrock.invoke_model(
        body=body,
        modelId="amazon.nova-lite-v1:0",
        contentType="application/json",
        accept="application/json"
    )

    result = json.loads(response.get('body').read())

    # Nova Lite response structure: output.message.content[0].text
    output_text = (
        result
        .get("output", {})
        .get("message", {})
        .get("content", [{}])[0]
        .get("text", "")
    )

    return {
        "language": language_name,
        "language_code": language_code,
        "analysis": output_text,
        "model": "amazon.nova-lite-v1:0"
    }