# Frontend - CoCreateAI

Interface moderna de chat desenvolvida com Next.js 15, React 19 e TypeScript.

## 🎨 Características

- ✅ **Chat Colapsável**: Painel lateral redimensionável
- ✅ **Histórico de Conversas**: Gerenciamento de múltiplas conversas
- ✅ **Sistema de Menções (@)**: Projetos, pessoas, processos e agentes
- ✅ **Gravação de Áudio**: Transcrição de voz
- ✅ **Customização Visual**: 2 cores personalizáveis (RGB/Hex)
- ✅ **Login/Autenticação**: Sistema de autenticação
- ✅ **Versão Mobile**: Interface otimizada (`/m`)
- ✅ **Tema Claro/Escuro**: Suporte completo
- ✅ **Markdown Support**: Renderização de respostas

## 📁 Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Rotas de autenticação
│   │   │   └── login/
│   │   ├── m/               # Versão mobile
│   │   ├── settings/        # Configurações
│   │   ├── globals.css      # Estilos globais
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   ├── components/
│   │   ├── chatbot-panel.tsx
│   │   ├── markdown-renderer.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/
│   │   ├── chat-context.tsx
│   │   └── theme-context.tsx
│   ├── hooks/
│   │   ├── use-chat.ts
│   │   └── use-theme.ts
│   ├── services/
│   │   └── api.ts           # Cliente API
│   └── types/
│       └── chat.ts
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🚀 Setup

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Neo4j (opcional para frontend)
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_username
NEO4J_PASSWORD=your_password
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse:
- **Desktop**: http://localhost:3000
- **Mobile**: http://localhost:3000/m
- **Login**: http://localhost:3000/login
- **Settings**: http://localhost:3000/settings

### 4. Build para Produção

```bash
npm run build
npm start
```

## 🎯 Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Chat desktop |
| `/m` | Chat mobile |
| `/login` | Página de login |
| `/settings` | Configurações do usuário |

## 🔌 Integração com Backend

### Cliente API

```typescript
// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const sendMessage = async (message: string, sessionId?: string) => {
  const response = await api.post('/api/chat', {
    message,
    session_id: sessionId
  })
  return response.data
}
```

### Hook de Chat

```typescript
// src/hooks/use-chat.ts
export function useChat() {
  const sendMessage = async (content: string) => {
    const response = await sendMessage(content, sessionId)
    // Processar resposta
  }
  
  return { messages, sendMessage, isLoading }
}
```

## 🎨 Customização Visual

### Cores Personalizáveis

O sistema permite customizar 2 cores principais:

```typescript
// Salvar cores
localStorage.setItem('primaryColor', '#FF6B6B')
localStorage.setItem('secondaryColor', '#4ECDC4')

// Aplicar cores
document.documentElement.style.setProperty('--primary', rgbValue)
document.documentElement.style.setProperty('--secondary', rgbValue)
```

### Temas

```typescript
import { useTheme } from 'next-themes'

function Component() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Alternar Tema
    </button>
  )
}
```

## 📱 Versão Mobile

A versão mobile (`/m`) possui:

- Layout fullscreen
- Drawer lateral para histórico
- Botão de gravação de áudio otimizado
- Gestos touch otimizados

## 🎙️ Gravação de Áudio

```typescript
// Iniciar gravação
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.start()
}

// Parar e transcrever
const stopRecording = async () => {
  mediaRecorder.stop()
  const audioBlob = await getAudioBlob()
  const transcription = await transcribeAudio(audioBlob)
}
```

## 🔍 Sistema de Menções

```typescript
// Detectar @
const handleInput = (text: string) => {
  if (text.includes('@')) {
    const query = extractMentionQuery(text)
    const suggestions = await fetchEntities(query)
    showSuggestions(suggestions)
  }
}

// Adicionar menção
const addMention = (entity: Entity) => {
  const mentionText = `@${entity.type}:${entity.id}`
  insertMention(mentionText)
}
```

## 🧩 Componentes Principais

### ChatbotPanel

```typescript
<ChatbotPanel 
  isExpanded={isExpanded}
  onToggle={() => setIsExpanded(!isExpanded)}
/>
```

### MarkdownRenderer

```typescript
<MarkdownRenderer content={message.content} />
```

### MessageList

```typescript
<MessageList 
  messages={messages}
  isLoading={isLoading}
/>
```

## 🎨 Estilização

### TailwindCSS

```typescript
// Classe utilitária
<div className="flex items-center gap-2 p-4 rounded-lg bg-background">
```

### CSS Variables

```css
:root {
  --primary: oklch(0.5 0.2 250);
  --secondary: oklch(0.6 0.15 180);
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
}
```

## 🔧 Desenvolvimento

### Adicionar Nova Página

```bash
# Criar arquivo
touch src/app/nova-pagina/page.tsx
```

```typescript
export default function NovaPagina() {
  return <div>Nova Página</div>
}
```

### Adicionar Novo Componente

```bash
# Criar componente
touch src/components/novo-componente.tsx
```

```typescript
export function NovoComponente() {
  return <div>Novo Componente</div>
}
```

### Adicionar shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
```

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "15.4.7",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@radix-ui/react-*": "^1.x",
    "lucide-react": "^0.540.0",
    "next-themes": "^0.4.6",
    "react-markdown": "^10.1.0",
    "tailwindcss": "^4.1.12"
  }
}
```

## 🧪 Testes

```bash
# Instalar dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Rodar testes
npm test
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**Interface desenvolvida com Next.js 15 ⚡**
