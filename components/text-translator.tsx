"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
]

export default function TextTranslator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("es")
  const [loading, setLoading] = useState(false)

  // Map language codes to Web Speech API language codes
  const getVoiceLang = (langCode: string): string => {
    const voiceMap: Record<string, string> = {
      "en": "en-US",
      "es": "es-ES",
      "fr": "fr-FR",
      "de": "de-DE",
      "it": "it-IT",
      "pt": "pt-PT",
      "pt-BR": "pt-BR",
      "ru": "ru-RU",
      "ja": "ja-JP",
      "ko": "ko-KR",
      "zh-CN": "zh-CN",
      "zh-TW": "zh-TW",
      "ar": "ar-SA",
      "hi": "hi-IN",
      "ta": "ta-IN",
    }
    return voiceMap[langCode] || langCode
  }

  const handleSpeak = async (text: string, langCode: string) => {
    if (!text.trim()) return
    
    // For non-Latin languages, use gTTS (Google Text-to-Speech) via Python backend
    const nonLatinLangs = ['ja', 'ko', 'zh-CN', 'zh-TW', 'hi', 'ar', 'ta']
    if (nonLatinLangs.includes(langCode)) {
      try {
        // Use gTTS through Python backend
        const response = await fetch('http://127.0.0.1:5002/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: text, 
            lang: langCode.split('-')[0] // Use base language code
          })
        })
        
        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audio.play()
          return
        }
      } catch (error) {
        console.error('gTTS error, falling back to browser TTS:', error)
      }
    }
    
    // Fallback to browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      // Function to actually speak
      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        const voiceLang = getVoiceLang(langCode)
        utterance.lang = voiceLang
        utterance.rate = 0.9
        utterance.pitch = 1
        
        // Try to find a voice for the language
        const voices = window.speechSynthesis.getVoices()
        console.log('Available voices:', voices.map(v => v.lang))
        console.log('Looking for language:', voiceLang)
        
        // Try exact match first, then language prefix
        let voice = voices.find(v => v.lang === voiceLang)
        if (!voice) {
          const langPrefix = voiceLang.split('-')[0]
          voice = voices.find(v => v.lang.startsWith(langPrefix))
        }
        
        if (voice) {
          console.log('Using voice:', voice.name, voice.lang)
          utterance.voice = voice
        } else {
          console.log('No specific voice found, using default for', voiceLang)
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
        }
        
        window.speechSynthesis.speak(utterance)
      }
      
      // Voices might not be loaded immediately, so we need to wait
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        speak()
      } else {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
          speak()
        }
        // Fallback: try after a short delay
        setTimeout(speak, 100)
      }
    } else {
      alert('Text-to-speech is not supported in your browser')
    }
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
        }),
      })

      const data = await response.json()
      setTranslatedText(data.translatedText || "")
    } catch (error) {
      console.error("Translation error:", error)
      setTranslatedText("Error translating text")
    } finally {
      setLoading(false)
    }
  }

  const handleSwapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Source */}
      <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">From</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-48 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />

        <div className="mt-4 text-sm text-muted-foreground">{sourceText.length} characters</div>
      </Card>

      {/* Target */}
      <Card className="p-6 bg-card border-border hover:border-secondary/50 transition-colors">
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">To</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={translatedText}
          readOnly
          placeholder="Translation will appear here..."
          className="w-full h-48 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none resize-none"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{translatedText.length} characters</span>
          {translatedText && (
            <Button
              onClick={() => handleSpeak(translatedText, targetLang)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              🔊 Listen
            </Button>
          )}
        </div>
      </Card>

      {/* Controls */}
      <div className="lg:col-span-2 flex gap-3 justify-center">
        <Button
          onClick={handleSwapLanguages}
          variant="outline"
          className="px-6 border-border hover:border-primary hover:text-primary bg-transparent"
        >
          ⇄ Swap Languages
        </Button>

        <Button
          onClick={handleTranslate}
          disabled={loading || !sourceText.trim()}
          className="px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
        >
          {loading ? "Translating..." : "Translate"}
        </Button>
      </div>
    </div>
  )
}
