# Guia de Instalação e Uso

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm, yarn ou pnpm como gerenciador de pacotes

## 🚀 Instalação Rápida

### 1. Instalar dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Executar em modo de desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 3. Acessar a aplicação

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🎨 Personalização

### Modificar Cores e Temas

Edite o arquivo `src/app/globals.css` para personalizar as cores:

```css
:root {
  --primary: oklch(0.205 0 0);  /* Cor primária */
  --background: oklch(1 0 0);   /* Cor de fundo */
  /* ... outras variáveis */
}
```

### Integrar com sua API

Modifique o arquivo `src/hooks/use-chat.ts`:

```typescript
const generateBotResponse = async (userMessage: string) => {
  // Substitua por sua chamada de API
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });
  
  const data = await response.json();
  return {
    answer: data.response,
    sources: data.sources
  };
};
```

### Customizar Mensagem de Boas-vindas

No arquivo `src/components/chatbot-panel.tsx`, altere a mensagem inicial:

```typescript
const { messages, isLoading, sendMessage, resetMessages } = useChat({
  initialMessages: [
    {
      id: "1",
      type: "bot",
      content: "Sua mensagem de boas-vindas aqui!",
      timestamp: new Date(),
    },
  ],
})
```

### Modificar Sugestões Rápidas

No mesmo arquivo `src/components/chatbot-panel.tsx`:

```typescript
const quickSuggestions = [
  { icon: Flag, text: "Sua sugestão 1", category: "Categoria" },
  { icon: FileText, text: "Sua sugestão 2", category: "Categoria" },
  // ...
]
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_KEY=sua-chave-api
```

### Build para Produção

```bash
npm run build
npm run start
```

## 📦 Estrutura de Arquivos Principais

```
chat-template/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos e temas
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página demo
│   ├── components/
│   │   ├── chatbot-panel.tsx    # ⭐ Componente principal
│   │   ├── markdown-renderer.tsx
│   │   └── ui/                  # Componentes UI
│   ├── hooks/
│   │   └── use-chat.ts          # ⭐ Lógica do chat (integre sua API aqui)
│   └── lib/
│       └── utils.ts
├── package.json
└── README.md
```

## 🎯 Uso em Outro Projeto

### Copiar apenas os arquivos necessários

Para integrar em um projeto Next.js existente:

1. Copie a pasta `src/components/chatbot-panel.tsx`
2. Copie a pasta `src/components/markdown-renderer.tsx`
3. Copie a pasta `src/components/ui/`
4. Copie a pasta `src/hooks/use-chat.ts`
5. Copie a pasta `src/lib/utils.ts`
6. Instale as dependências necessárias:

```bash
npm install lucide-react react-markdown remark-gfm @radix-ui/react-scroll-area class-variance-authority clsx tailwind-merge
```

7. Adicione ao seu layout ou página:

```tsx
import ChatbotPanel from '@/components/chatbot-panel'

export default function YourPage() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <>
      {/* Seu conteúdo */}
      <ChatbotPanel 
        isExpanded={isExpanded} 
        onToggle={() => setIsExpanded(!isExpanded)} 
      />
    </>
  )
}
```

## 🆘 Solução de Problemas

### Erro de importação do Tailwind

Se você encontrar erros relacionados ao Tailwind CSS, verifique:

1. `postcss.config.mjs` está configurado
2. `globals.css` importa o tailwindcss
3. Instalou `@tailwindcss/postcss` e `tailwindcss`

### Componentes UI não aparecem

Certifique-se de que:

1. Todas as dependências foram instaladas
2. O arquivo `src/lib/utils.ts` existe
3. O tsconfig.json tem os path aliases configurados

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## 💡 Dicas

- O chat é **responsivo** e se adapta a telas menores
- Você pode **redimensionar** o painel arrastando a borda esquerda
- O chat suporta **Markdown** nas respostas
- As mensagens são **scrolláveis** automaticamente

## 🤝 Contribuições

Este é um template inicial. Customize conforme suas necessidades!
