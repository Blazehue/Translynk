import sys
import logging

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    from deep_translator import GoogleTranslator
    from langdetect import detect, DetectorFactory, LangDetectException
    from gtts import gTTS
    import io
except ImportError as e:
    print(f"Error: Missing required packages. Please run:")
    print("pip install -r requirements.txt")
    sys.exit(1)

# Ensure deterministic language detection
DetectorFactory.seed = 0

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'note': 'Python translation proxy (deep-translator + langdetect) running'})

@app.route('/detect', methods=['POST'])
def detect_route():
    body = request.get_json(force=True)
    q = body.get('q', '')
    if not q:
        return jsonify([]), 200
    try:
        lang = detect(q)
        # return a list to match previous client's expectations
        return jsonify([{'language': lang, 'confidence': None}]), 200
    except LangDetectException as e:
        return jsonify({'error': 'detect failed', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'detect unexpected error', 'details': str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate_route():
    body = request.get_json(force=True)
    q = body.get('q', '')
    source = body.get('source', 'auto')
    target = body.get('target', 'en')
    if q is None:
        return jsonify({'translatedText': ''}), 200
    try:
        # If source is 'auto', let langdetect pick it for better reliability
        src = None
        if source and source != 'auto':
            src = source
        else:
            try:
                detected = detect(q)
                src = detected
            except Exception:
                src = 'auto'
        # deep-translator GoogleTranslator: specify src if available, else use 'auto' via leaving src unset
        if src == 'auto' or src is None:
            translated = GoogleTranslator(source='auto', target=target).translate(q)
            used_src = 'auto'
        else:
            translated = GoogleTranslator(source=src, target=target).translate(q)
            used_src = src
        return jsonify({'translatedText': translated, 'src': used_src, 'dest': target}), 200
    except Exception as e:
        return jsonify({'error': 'translate failed', 'details': str(e)}), 500

@app.route('/tts', methods=['POST'])
def text_to_speech():
    body = request.get_json(force=True)
    text = body.get('text', '')
    lang = body.get('lang', 'en')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Map language codes to gTTS language codes
        lang_map = {
            'zh': 'zh-CN',
            'zh-CN': 'zh-CN',
            'zh-TW': 'zh-TW',
        }
        gtts_lang = lang_map.get(lang, lang)
        
        # Create gTTS object
        tts = gTTS(text=text, lang=gtts_lang, slow=False)
        
        # Save to BytesIO object
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        
        # Return audio file
        return audio_fp.getvalue(), 200, {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'inline; filename=speech.mp3'
        }
    except Exception as e:
        return jsonify({'error': 'TTS failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
