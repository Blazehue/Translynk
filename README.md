# 🌐 Translynk

**An AI-Powered Multi-Modal Translation Application**

> *This project was built with love for a friend of mine who wanted a powerful, easy-to-use translation tool that works seamlessly across different languages and input methods.*

---

## ✨ Features

### 🔤 **Text Translation**
- Translate between 14 languages with high accuracy
- Clean, intuitive interface
- Real-time translation
- Text-to-speech support for all languages

### 🎤 **Speech Translation**
- Record your voice in any supported language
- Automatic language detection
- Instant translation with audio playback
- Perfect for real-time conversations

### 🖼️ **Image Translation (OCR)**
- Upload images with text
- Extract text using OCR technology
- Translate extracted text
- Listen to translations

### 🔊 **Text-to-Speech**
- High-quality voice synthesis
- Special support for non-Latin scripts (Chinese, Japanese, Korean, Hindi, Arabic, Tamil)
- Uses Google Text-to-Speech (gTTS) for Asian languages
- Browser-based TTS for Latin languages

---

## 🌍 Supported Languages

1. 🇬🇧 **English**
2. 🇪🇸 **Spanish**
3. 🇫🇷 **French**
4. 🇩🇪 **German**
5. 🇮🇹 **Italian**
6. 🇵🇹 **Portuguese**
7. 🇷🇺 **Russian**
8. 🇯🇵 **Japanese**
9. 🇰🇷 **Korean**
10. 🇨🇳 **Chinese (Simplified)**
11. 🇹🇼 **Chinese (Traditional)**
12. 🇸🇦 **Arabic**
13. 🇮🇳 **Hindi**
14. 🇮🇳 **Tamil**

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 13** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Web Speech API** - Browser-based speech recognition and synthesis

### Backend
- **Python 3.12** - Server runtime
- **Flask** - Web framework
- **deep-translator** - Translation engine
- **langdetect** - Language detection
- **gTTS (Google Text-to-Speech)** - High-quality voice synthesis
- **Flask-CORS** - Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.12+
- pip (Python package manager)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd translator-app
```

#### 2. Install Frontend Dependencies
```bash
npm install
# or
pnpm install
```

#### 3. Setup Python Backend
```bash
cd python_server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Running the Application

#### 1. Start the Python Backend (Terminal 1)
```bash
cd python_server
.\venv\Scripts\python.exe server.py
```
The Python server will start on **http://127.0.0.1:5002**

#### 2. Start the Next.js Frontend (Terminal 2)
```bash
npm run dev
# or
pnpm dev
```
The frontend will start on **http://localhost:3000** (or next available port)

#### 3. Open Your Browser
Navigate to the URL shown in your terminal (usually http://localhost:3000)

---

## 📖 Usage Guide

### Text Translation
1. Navigate to the **Text Translation** tab
2. Select source and target languages
3. Type or paste your text
4. Click **Translate**
5. Click the 🔊 **Listen** button to hear the translation

### Speech Translation
1. Navigate to the **Speech Translation** tab
2. Select your target language
3. Click **Start Recording**
4. Speak clearly into your microphone
5. Click **Stop Recording**
6. The app will automatically detect your language, translate, and speak the result
7. Click **Listen Again** to replay the translation

### Image Translation
1. Navigate to the **Image Translation** tab
2. Click **Choose Image** or drag and drop an image
3. The app will extract text using OCR
4. View the extracted text and its translation
5. Click 🔊 **Listen** to hear the translation

---

## 🎨 Features in Detail

### Smart Text-to-Speech
Translynk uses an intelligent system to provide the best voice quality:
- **Non-Latin Languages** (Chinese, Japanese, Korean, Hindi, Arabic, Tamil): Uses Google Text-to-Speech via the Python backend for native-quality pronunciation
- **Latin Languages** (English, Spanish, French, etc.): Uses browser's built-in Web Speech API for instant playback
- **Automatic Fallback**: If the primary TTS method fails, automatically falls back to the alternative

### Language Detection
Automatically detects the source language when translating, making it easier to use without manual language selection.

### Clean History Management
The interface has been optimized to remove clutter and focus on the translation experience.

---

## 🔧 Configuration

### Python Server
The Python server runs on port **5002** by default. You can change this in `python_server/server.py`:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
```

### Frontend API URLs
The frontend connects to the Python backend at `http://127.0.0.1:5002`. If you change the port, update the API calls in:
- `components/text-translator.tsx`
- `components/speech-translator.tsx`
- `components/image-translator.tsx`

---

## 📦 Project Structure

```
translator-app/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes (currently unused)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── translator-client.tsx    # Legacy translator component
├── components/                   # React components
│   ├── text-translator.tsx      # Text translation component
│   ├── speech-translator.tsx    # Speech translation component
│   ├── image-translator.tsx     # Image translation component
│   └── ui/                      # UI component library
├── python_server/               # Python backend
│   ├── server.py               # Flask server
│   ├── requirements.txt        # Python dependencies
│   └── venv/                   # Virtual environment
├── public/                      # Static assets
├── lib/                        # Utility functions
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Python Server Won't Start
- Ensure Python 3.12+ is installed: `python --version`
- Activate the virtual environment before running
- Install dependencies: `pip install -r requirements.txt`

### Translation Not Working
- Check if the Python server is running on port 5002
- Verify the server is accessible: Open http://127.0.0.1:5002 in your browser
- Check browser console for errors (F12)

### Text-to-Speech Not Working
- **For Latin languages**: Ensure your browser supports Web Speech API (Chrome, Edge recommended)
- **For Asian languages**: Ensure the Python server is running and gTTS is installed
- Check if `gTTS` package is installed: `pip show gTTS`

### Port Already in Use
If port 3000 or 5002 is already in use:
- Frontend: Next.js will automatically try the next available port (3001, 3002, etc.)
- Backend: Change the port in `python_server/server.py`

---

## 🔮 Future Enhancements

- [ ] Add more languages
- [ ] Document translation (PDF, DOCX)
- [ ] Translation history with local storage
- [ ] Offline mode for basic translations
- [ ] Mobile app version
- [ ] Custom voice selection
- [ ] Pronunciation guides
- [ ] Phrasebook feature

---

## 🤝 Contributing

This project was built for personal use, but if you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 💝 Acknowledgments

This project was built as a gift for a friend who needed a reliable, feature-rich translation tool. Special thanks to:
- **deep-translator** - For providing a robust translation API
- **Google Text-to-Speech (gTTS)** - For high-quality voice synthesis
- **Next.js & React** - For the amazing frontend framework
- **Flask** - For the simple yet powerful backend framework

---

## 📧 Contact

If you have questions or suggestions, feel free to reach out!

---

**Built with ❤️ for a friend**

*Making language barriers a thing of the past, one translation at a time.* 🌍✨
