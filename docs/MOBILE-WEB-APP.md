# 📱 Chat Mobile Web App

## 🎯 Visão Geral

Versão mobile otimizada do chat, acessível via **`/m`**, projetada para uso em smartphones e tablets sem necessidade de instalação de app.

## 🚀 Acesso

### URL:
```
http://localhost:3000/m          (desenvolvimento)
https://seudominio.com/m         (produção)
```

## ✨ Funcionalidades Mobile

### 1. **Interface Full Screen**
- ✅ Chat ocupa tela inteira
- ✅ Sem elementos decorativos
- ✅ Otimizado para toque
- ✅ Sem necessidade de expansão/colapsação

### 2. **Histórico como Drawer**
- ✅ Menu hamburger (☰) no canto superior esquerdo
- ✅ Histórico desliza da esquerda
- ✅ Busca de conversas integrada
- ✅ Marcação de KB disponível
- ✅ Deletar conversas

### 3. **Gravação de Áudio** 🎙️
- ✅ Botão de microfone integrado
- ✅ Gravação em tempo real com timer
- ✅ Visualização de ondas durante gravação
- ✅ Botões para parar/enviar
- ✅ Suporte nativo do navegador

### 4. **Gestos Touch**
- ✅ Swipe para abrir histórico (Sheet)
- ✅ Tap para fechar
- ✅ Scroll suave de mensagens

## 📋 Componentes Criados

### 1. **`/m/page.tsx`**
```tsx
// Rota mobile
export default function MobileChatPage() {
  return (
    <ChatbotPanelWithHistory isMobile={true} />
  )
}
```

### 2. **`AudioRecorder` Component**
```tsx
<AudioRecorder 
  onAudioRecorded={(blob) => {
    // Processa áudio
    // Envia para transcrição
    // Adiciona ao chat
  }}
/>
```

**Recursos:**
- 🎙️ Captura via `MediaRecorder API`
- ⏱️ Timer de gravação
- 🔴 Indicador visual durante gravação
- ✅ Cancelar ou enviar
- 📱 Permissões automáticas

### 3. **`Sheet` Component (Drawer)**
```tsx
<Sheet>
  <SheetTrigger>☰ Menu</SheetTrigger>
  <SheetContent side="left">
    <ConversationHistory />
  </SheetContent>
</Sheet>
```

## 🎨 Design Mobile

### Layout:
```
┌─────────────────────────┐
│ ☰  Assistente Virtual  + │  ← Header fixo
├─────────────────────────┤
│                         │
│   Mensagens (scroll)    │  ← Área de chat
│                         │
│                         │
├─────────────────────────┤
│ [texto] 🎙️ [enviar]    │  ← Input fixo
└─────────────────────────┘
```

### Drawer Aberto:
```
┌──────────┬──────────────┐
│          │              │
│ Histórico│    Chat      │
│          │              │
│ Conversas│              │
│ [ ... ]  │              │
│          │              │
└──────────┴──────────────┘
   ←swipe     tap→
```

## 🔧 Diferenças Desktop vs Mobile

| Recurso | Desktop | Mobile |
|---|---|---|
| **Layout** | Lateral direito | Full screen |
| **Histórico** | Painel lateral | Drawer (Sheet) |
| **Colapsável** | Sim | Não (sempre visível) |
| **Redimensionável** | Sim (arraste borda) | Não |
| **Header** | Com background/page | Só chat |
| **Áudio** | Botão microfone | Botão microfone |
| **Navegação** | Mouse | Touch |
| **Scroll** | Mouse wheel | Touch swipe |

## 🎙️ Gravação de Áudio

### Como Usar:
1. **Clique no ícone 🎙️**
2. **Permita acesso ao microfone** (navegador pergunta)
3. **Fale sua mensagem** (timer mostra tempo)
4. **Clique ⏹️ para parar**
5. **Clique ✉️ para enviar** ou **❌ para cancelar**

### Estados Visuais:

**Aguardando:**
```
┌─────┐
│ 🎙️  │  ← Cinza, pronto
└─────┘
```

**Gravando:**
```
┌──────────────────┬───┐
│ 🔴 0:15         │ ⏹️ │  ← Vermelho, animado
└──────────────────┴───┘
```

**Pronto:**
```
┌──────────────────┬───┬───┐
│ 🔴 0:23         │ ❌ │ ✉️ │  ← Cancelar ou Enviar
└──────────────────┴───┴───┘
```

### Formatos Suportados:
- **WebM** (padrão Chrome/Edge)
- **MP4** (Safari iOS)
- **OGG** (Firefox)

### Permissões:
- **Primeira vez:** Navegador pede permissão
- **Subsequente:** Automático (se permitido)
- **Bloqueado:** Mensagem de erro aparece

## 🔌 Integração com Transcrição

### Placeholder Atual:
```tsx
const handleAudioRecorded = async (audioBlob: Blob) => {
  // Simulação
  const text = '[Áudio gravado - transcrição pendente]'
  await sendMessage(text)
}
```

### Integração Real (Whisper API):
```tsx
const handleAudioRecorded = async (audioBlob: Blob) => {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  formData.append('model', 'whisper-1')
  
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData
  })
  
  const { text } = await response.json()
  await sendMessage(text)
}
```

### API Route (`/api/transcribe/route.ts`):
```typescript
import { OpenAI } from 'openai'

export async function POST(request: Request) {
  const formData = await request.formData()
  const audio = formData.get('audio') as Blob
  
  const openai = new OpenAI()
  const transcription = await openai.audio.transcriptions.create({
    file: audio,
    model: 'whisper-1',
    language: 'pt' // Português
  })
  
  return Response.json({ text: transcription.text })
}
```

## 📱 PWA (Progressive Web App) - Opcional

Para transformar em app instalável:

### 1. Criar `manifest.json`:
```json
{
  "name": "Assistente Virtual",
  "short_name": "Chat AI",
  "description": "Seu assistente inteligente",
  "start_url": "/m",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Adicionar no `layout.tsx`:
```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

### 3. Service Worker (opcional):
```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
})
```

## 🧪 Teste Mobile

### 1. Localhost Mobile:
```bash
npm run dev

# Acesse do celular (mesma rede Wi-Fi):
http://192.168.x.x:3000/m
```

### 2. Chrome DevTools:
- F12 → Toggle device toolbar (Ctrl+Shift+M)
- Selecione dispositivo (iPhone, Android)
- Teste gestos, scroll, inputs

### 3. Teste Real:
- Use Ngrok/Localtunnel para HTTPS
- Teste em dispositivos físicos
- Verifique permissões de microfone

## 🎯 Próximas Melhorias Sugeridas

### UX:
- ✅ **Vibração háptica** ao gravar/enviar
- ✅ **Ícones maiores** para facilitar toque
- ✅ **Swipe para deletar** conversa
- ✅ **Pull to refresh** para recarregar

### Funcionalidades:
- ✅ **Upload de fotos** da galeria
- ✅ **Câmera integrada** para fotos
- ✅ **Compartilhar** conversa
- ✅ **Modo offline** (PWA + Service Worker)
- ✅ **Notificações push**

### Áudio:
- ✅ **Visualização de ondas** durante gravação
- ✅ **Player** para ouvir antes de enviar
- ✅ **Editar** áudio (cortar início/fim)
- ✅ **Cancelar** gravação com gesto

## 📊 Performance Mobile

### Otimizações Aplicadas:
- ✅ **Lazy loading** de componentes
- ✅ **Virtualization** de lista (muitas mensagens)
- ✅ **Debounce** em inputs
- ✅ **Service Worker** para cache (opcional)

### Métricas Alvo:
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

## 🔐 Segurança

### Permissões:
- **Microfone:** Solicitada apenas quando necessário
- **HTTPS:** Obrigatório para microfone em produção
- **Tokens:** Armazenados de forma segura

### Privacidade:
- **Áudio:** Não armazenado localmente
- **Transcrição:** Processada em servidor
- **Conversas:** localStorage (criptografável)

## 🚀 Deploy Mobile

### Recomendações:
1. **Vercel/Netlify** → Deploy automático
2. **HTTPS obrigatório** → Microfone requer
3. **CDN** → Assets estáticos
4. **Edge Functions** → Transcrição rápida

### Exemplo Vercel:
```bash
vercel --prod
# Acesse: https://seuapp.vercel.app/m
```

---

## ✅ Resumo

**Versão mobile implementada com:**
- 📱 Interface full screen otimizada
- ☰ Drawer para histórico
- 🎙️ Gravação de áudio integrada
- 📝 Mesmas funcionalidades do desktop
- 🚀 Pronto para uso imediato
- 🔌 Placeholder para transcrição

**Acesse agora:** `http://localhost:3000/m` 🎉
