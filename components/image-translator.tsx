"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "german" },
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

export default function ImageTranslator() {
  const [image, setImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [targetLang, setTargetLang] = useState("es")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const speakText = async (text: string, langCode: string) => {
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
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Display image
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Process image
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setExtractedText(data.text || "")

      // Translate extracted text
      if (data.text) {
        const translateResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.text,
            sourceLang: "en",
            targetLang,
          }),
        })

        const translateData = await translateResponse.json()
        setTranslatedText(translateData.translatedText || "")
      }
    } catch (error) {
      console.error("Image processing error:", error)
      setExtractedText("Error processing image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-border border-dashed">
        <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="mb-4 text-5xl">🖼️</div>
          <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
          <p className="text-muted-foreground mb-4">Click to select an image or drag and drop</p>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
            Choose Image
          </Button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </Card>

      {/* Results */}
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Image */}
          <Card className="p-4 bg-card border-border">
            <h4 className="font-semibold mb-3 text-foreground">Original Image</h4>
            <div className="relative w-full h-64 bg-input rounded-lg overflow-hidden">
              <Image src={image || "/placeholder.svg"} alt="Original" fill className="object-cover" />
            </div>
          </Card>

          {/* Extracted Text */}
          <Card className="p-4 bg-card border-border">
            <h4 className="font-semibold mb-3 text-foreground">Extracted Text</h4>
            <div className="p-4 bg-input border border-border rounded-lg text-foreground min-h-64 overflow-y-auto">
              {loading ? "Processing..." : extractedText || "No text found"}
            </div>
          </Card>

          {/* Translated Text */}
          <Card className="p-4 bg-card border-border">
            <div className="mb-3">
              <label className="block text-sm font-medium text-foreground mb-2">Translate to:</label>
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
            <div className="p-4 bg-input border border-border rounded-lg text-foreground min-h-64 overflow-y-auto">
              {loading ? "Translating..." : translatedText || "Translation will appear here"}
            </div>
            {translatedText && !loading && (
              <div className="mt-4">
                <Button
                  onClick={() => speakText(translatedText, targetLang)}
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                >
                  🔊 Listen
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
