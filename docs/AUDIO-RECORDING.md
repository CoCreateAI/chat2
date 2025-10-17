# 🎙️ Gravação de Áudio - Guia Completo

## 📋 Visão Geral

Sistema de gravação de áudio integrado ao chat, funcionando em **desktop** e **mobile**, com suporte a transcrição via API.

## ✨ Funcionalidades

- ✅ **Gravação nativa** via MediaRecorder API
- ✅ **Timer em tempo real**
- ✅ **Indicadores visuais** (gravando, pronto, erro)
- ✅ **Cancelar/Enviar** gravação
- ✅ **Permissões automáticas** do navegador
- ✅ **Compatível** com Chrome, Firefox, Safari, Edge

## 🎯 Como Funciona

### 1. **Usuário clica no botão 🎙️**
### 2. **Navegador pede permissão** (primeira vez)
### 3. **Gravação inicia** com timer
### 4. **Usuário para** a gravação (⏹️)
### 5. **Escolhe:** Enviar (✉️) ou Cancelar (❌)
### 6. **Áudio enviado** para processamento/transcrição

## 🔧 Componente AudioRecorder

### Uso Básico:
```tsx
import { AudioRecorder } from '@/components/audio-recorder'

<AudioRecorder 
  onAudioRecorded={(audioBlob) => {
    console.log('Áudio gravado:', audioBlob)
    // Processar áudio aqui
  }}
/>
```

### Props:
```typescript
interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void  // Callback quando áudio é enviado
  className?: string                          // Classes CSS opcionais
}
```

### Estados:

#### 1. **Aguardando** (inicial):
```
🎙️  ← Botão cinza, pronto para clicar
```

#### 2. **Gravando**:
```
🔴 0:15  ⏹️
↑ red   ↑ parar
```

#### 3. **Gravado (pronto para enviar)**:
```
🔴 0:23  ❌  ✉️
↑ timer  ↑   ↑ enviar
        cancelar
```

## 📱 Integração no Chat

### Desktop:
```tsx
// chatbot-panel-with-history.tsx (desktop)
<div className="p-4 border-t border-border">
  <div className="flex gap-2">
    <Paperclip />
    <textarea />
    <AudioRecorder onAudioRecorded={handleAudioRecorded} />  ← Aqui
    <Button>Enviar</Button>
  </div>
</div>
```

### Mobile:
```tsx
// chatbot-panel-with-history.tsx (mobile render)
<div className="p-4 border-t border-border">
  <div className="flex gap-2">
    <textarea />
    <AudioRecorder onAudioRecorded={handleAudioRecorded} />  ← Aqui
    <Button>Enviar</Button>
  </div>
</div>
```

## 🔌 Processamento de Áudio

### 1. **Placeholder Atual** (sem API):
```typescript
const handleAudioRecorded = async (audioBlob: Blob) => {
  // Simulação
  const text = '[Áudio gravado - transcrição pendente]'
  await sendMessage(text)
}
```

### 2. **Com API de Transcrição** (OpenAI Whisper):

#### Frontend (`chatbot-panel-with-history.tsx`):
```typescript
const handleAudioRecorded = async (audioBlob: Blob) => {
  try {
    // Mostrar loading
    setIsLoading(true)
    
    // Criar FormData
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    
    // Enviar para API
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Erro na transcrição')
    }
    
    const { text } = await response.json()
    
    // Enviar texto transcrito como mensagem
    await sendMessage(text)
    
  } catch (error) {
    console.error('Erro ao processar áudio:', error)
    alert('Erro ao processar áudio. Tente novamente.')
  } finally {
    setIsLoading(false)
  }
}
```

#### Backend (`src/app/api/transcribe/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de áudio fornecido' },
        { status: 400 }
      )
    }
    
    // Transcrever com Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pt',  // Português
      response_format: 'json'
    })
    
    return NextResponse.json({ 
      text: transcription.text 
    })
    
  } catch (error) {
    console.error('Erro na transcrição:', error)
    return NextResponse.json(
      { error: 'Erro ao transcrever áudio' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false  // Importante para FormData
  }
}
```

### 3. **Variáveis de Ambiente** (`.env.local`):
```bash
OPENAI_API_KEY=sk-...your-api-key...
```

### 4. **Instalar Dependência**:
```bash
npm install openai
```

## 🌐 Alternativas de Transcrição

### 1. **Google Cloud Speech-to-Text**:
```typescript
import speech from '@google-cloud/speech'

const client = new speech.SpeechClient()

const [response] = await client.recognize({
  audio: { content: audioBuffer.toString('base64') },
  config: {
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'pt-BR',
  },
})

const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n')
```

### 2. **Azure Speech Services**:
```typescript
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  process.env.AZURE_SPEECH_REGION
)
speechConfig.speechRecognitionLanguage = 'pt-BR'

const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile)
const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

const result = await new Promise((resolve, reject) => {
  recognizer.recognizeOnceAsync(
    result => resolve(result.text),
    error => reject(error)
  )
})
```

### 3. **AssemblyAI**:
```typescript
const assembly = require('assemblyai')

const client = assembly.AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
})

const transcript = await client.transcripts.create({
  audio_url: uploadedAudioUrl,
  language_code: 'pt'
})

await client.transcripts.waitUntilReady(transcript.id)
const text = transcript.text
```

## 🎨 Personalização Visual

### Cores e Estilos:
```tsx
// Estado gravando (vermelho)
<div className="bg-destructive/10 text-destructive">
  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
  <span>{formatTime(recordingTime)}</span>
</div>

// Botão parar (vermelho)
<Button variant="destructive">
  <Square className="h-4 w-4 fill-current" />
</Button>

// Botão enviar (verde/primário)
<Button variant="default">
  <Send className="h-4 w-4" />
</Button>
```

### Timer Formatado:
```typescript
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Exemplo: 0:05, 1:23, 10:00
```

## 🔐 Permissões e Segurança

### Permissões do Navegador:
```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: true 
  })
  // Permissão concedida ✅
} catch (error) {
  if (error.name === 'NotAllowedError') {
    alert('Permissão de microfone negada')
  } else if (error.name === 'NotFoundError') {
    alert('Nenhum microfone encontrado')
  } else {
    alert('Erro ao acessar microfone')
  }
}
```

### Requisitos HTTPS:
⚠️ **Microfone só funciona em:**
- `localhost` (desenvolvimento)
- **HTTPS** (produção)

### Limpeza de Recursos:
```typescript
useEffect(() => {
  return () => {
    // Parar gravação ao desmontar
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    // Parar timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
}, [])
```

## 📊 Formatos de Áudio

### Por Navegador:
| Navegador | Formato | MIME Type |
|---|---|---|
| Chrome | WebM | `audio/webm` |
| Firefox | Ogg | `audio/ogg` |
| Safari | MP4 | `audio/mp4` |
| Edge | WebM | `audio/webm` |

### Conversão (se necessário):
```bash
# FFmpeg no servidor
ffmpeg -i input.webm -ar 16000 -ac 1 output.wav
```

## 🧪 Testes

### 1. **Navegador Desktop:**
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

### 2. **Mobile:**
- Chrome Android ✅
- Safari iOS ✅
- Firefox Mobile ✅

### 3. **Cenários:**
- ✅ Permissão concedida
- ✅ Permissão negada
- ✅ Sem microfone
- ✅ Gravação longa (> 5 min)
- ✅ Cancelar gravação
- ✅ Múltiplas gravações seguidas

## 📈 Melhorias Futuras

### UX:
- [ ] **Visualização de onda** durante gravação
- [ ] **Player** para ouvir antes de enviar
- [ ] **Indicador de nível** de volume
- [ ] **Vibração háptica** (mobile)
- [ ] **Atalho de teclado** (Ctrl+M)

### Funcionalidades:
- [ ] **Pausar/Retomar** gravação
- [ ] **Editar** início/fim
- [ ] **Limite de tempo** configurável
- [ ] **Compressão** de áudio
- [ ] **Armazenar** histórico de áudios

### Performance:
- [ ] **Streaming** para servidor (real-time)
- [ ] **Compressão** antes de enviar
- [ ] **Cache** de transcrições
- [ ] **Retry** automático em caso de erro

## 📝 Exemplo Completo

### Uso no Componente:
```tsx
import { AudioRecorder } from '@/components/audio-recorder'
import { useState } from 'react'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  
  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })
      
      const { text } = await res.json()
      setMessage(text)  // Preenche input com transcrição
      
    } catch (error) {
      console.error(error)
      alert('Erro na transcrição')
    } finally {
      setIsTranscribing(false)
    }
  }
  
  return (
    <div className="flex gap-2">
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isTranscribing ? 'Transcrevendo...' : 'Digite...'}
        disabled={isTranscribing}
      />
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      <button onClick={() => sendMessage(message)}>
        Enviar
      </button>
    </div>
  )
}
```

---

## ✅ Pronto para Uso!

**Gravação de áudio implementada e funcionando em:**
- ✅ Desktop
- ✅ Mobile
- ✅ Com placeholder para transcrição
- ✅ Pronto para integrar API real

**Teste agora e adicione sua API de transcrição!** 🎙️✨
