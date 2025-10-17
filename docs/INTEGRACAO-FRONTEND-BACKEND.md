# Integração Frontend-Backend

Documentação completa da integração entre o frontend Next.js e o backend Agno.

## 🔗 Visão Geral

O frontend agora está completamente integrado com o backend Agno, substituindo as respostas simuladas por chamadas reais à API.

## 📡 Arquitetura da Integração

```
Frontend (Next.js)
    ↓
use-chat.ts (Hook)
    ↓
api.ts (Cliente HTTP)
    ↓
Backend FastAPI (localhost:8000)
    ↓
Chat Agent (Agno)
    ↓
Azure OpenAI + Neo4j
```

## 🔧 Componentes Criados

### 1. Cliente API (`frontend/src/services/api.ts`)

Cliente HTTP para comunicação com o backend.

#### Funções Principais:

**`sendChatMessage(message, sessionId?, context?)`**
- Envia mensagem para o chat agent
- Retorna resposta do Azure OpenAI
- Mantém contexto da sessão

**`healthCheck()`**
- Verifica se backend está disponível
- Usado para fallback automático

**`ingestDocument(document, documentType)`**
- Ingere documentos no Neo4j
- Para alimentar knowledge base

**`createEntity(entityType, properties)`**
- Cria entidades no grafo
- Suporta: Project, Person, Process, Agent

#### Exemplo de Uso:

```typescript
import { sendChatMessage } from '@/services/api';

const response = await sendChatMessage(
  "Qual o status do projeto X?",
  "session-123",
  { mentions: [{ id: "proj-x", type: "project", name: "Projeto X" }] }
);

console.log(response.response); // Resposta do Azure OpenAI
```

### 2. Hook Atualizado (`frontend/src/hooks/use-chat.ts`)

Hook React para gerenciar estado do chat.

#### Mudanças Principais:

1. **Importa cliente API**
```typescript
import { sendChatMessage, healthCheck } from '@/services/api';
```

2. **Verifica backend ao montar**
```typescript
useEffect(() => {
  const checkBackend = async () => {
    const available = await healthCheck();
    setBackendAvailable(available);
  };
  checkBackend();
}, []);
```

3. **Chama backend real**
```typescript
const response = await sendChatMessage(userMessage, currentSessionId, context);
```

4. **Fallback automático**
- Se backend offline, mostra mensagem de aviso
- Não quebra a aplicação

#### Exemplo de Uso:

```typescript
import { useChat } from '@/hooks/use-chat';

function ChatComponent() {
  const { messages, isLoading, sendMessage } = useChat({
    sessionId: 'user-123',
    onError: (error) => console.error(error)
  });

  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      <Input onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

## 🔄 Fluxo de Mensagem

### 1. Usuário envia mensagem

```typescript
sendMessage("Como funciona o sistema?")
```

### 2. Hook processa

```typescript
// Extrai menções (@)
const mentions = extractMentions(content);

// Cria mensagem do usuário
const userMessage = {
  id: Date.now().toString(),
  type: 'user',
  content: content,
  timestamp: new Date(),
  mentions: mentions
};

// Adiciona ao estado
setMessages(prev => [...prev, userMessage]);
```

### 3. Chama backend

```typescript
const response = await sendChatMessage(
  content,
  currentSessionId,
  { mentions }
);
```

### 4. Backend processa

```python
# FastAPI recebe request
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Chat Agent processa com Agno
    response = await chat_agent.chat(
        message=request.message,
        session_id=request.session_id,
        context=request.context
    )
    return ChatResponse(response=response)
```

### 5. Agno processa

```python
# Agent envia para Azure OpenAI
response = self.agent.run(message, session_id=session_id)

# Retorna resposta
return response.content
```

### 6. Frontend exibe resposta

```typescript
const botMessage = {
  id: (Date.now() + 1).toString(),
  type: 'bot',
  content: response.response,
  timestamp: new Date(),
  sources: ['Azure OpenAI', 'Neo4j Knowledge Graph']
};

setMessages(prev => [...prev, botMessage]);
```

## 🎯 Recursos Integrados

### ✅ Implementados

- **Chat em tempo real** com Azure OpenAI
- **Histórico de sessão** via SQLite (Agno)
- **Detecção de backend** com fallback
- **Sistema de menções** (@) enviado ao backend
- **Contexto de entidades** para enriquecer respostas
- **Tratamento de erros** robusto

### 🚧 Próximas Integrações

- **Busca semântica** no Neo4j
- **RAG** (Retrieval Augmented Generation)
- **Streaming de respostas** (Server-Sent Events)
- **Upload de arquivos** para ingestão
- **Visualização do grafo** Neo4j

## 🔐 Segurança

### Frontend

- **Variáveis de ambiente** com `NEXT_PUBLIC_` prefix
- **Validação de input** antes de enviar
- **Sanitização** de menções

### Backend

- **CORS** configurado para origens específicas
- **Validação** com Pydantic
- **Rate limiting** (a implementar)
- **Autenticação** (a implementar)

## 🧪 Testando a Integração

### 1. Iniciar Backend

```bash
cd backend
venv\Scripts\activate
python -m src.main
```

Verifique: http://localhost:8000/health

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev
```

Acesse: http://localhost:3000

### 3. Testar Chat

1. Digite uma mensagem
2. Aguarde resposta do Azure OpenAI
3. Verifique console do backend para logs

### 4. Testar Menções

1. Digite: `@[Projeto X](project:proj-x) qual o status?`
2. Backend recebe contexto da menção
3. Pode usar para buscar no Neo4j

## 🐛 Troubleshooting

### Erro: "Backend não disponível"

**Causa**: Backend não está rodando ou URL incorreta

**Solução**:
```bash
# Verificar se backend está rodando
curl http://localhost:8000/health

# Verificar .env do frontend
cat frontend/.env
# Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Erro: "CORS policy"

**Causa**: Frontend rodando em porta não autorizada

**Solução**:
```python
# backend/src/config/settings.py
cors_origins: str = "http://localhost:3000,http://localhost:3001"
```

### Erro: "Cannot import name 'AzureOpenAI'"

**Causa**: Versão incorreta do Agno

**Solução**:
```bash
pip install --upgrade agno
```

### Resposta lenta

**Causa**: Azure OpenAI pode demorar alguns segundos

**Solução**: Normal. Considere adicionar streaming no futuro.

## 📊 Monitoramento

### Logs do Frontend

```typescript
// Console do navegador
console.log('Enviando mensagem:', message);
console.log('Resposta recebida:', response);
```

### Logs do Backend

```python
# Terminal do backend
logger.info(f"Mensagem recebida: {request.message}")
logger.info(f"Resposta gerada: {response}")
```

### Network Tab

1. Abra DevTools (F12)
2. Aba "Network"
3. Filtre por "chat"
4. Veja requests/responses

## 🚀 Próximos Passos

1. **Implementar streaming** para respostas em tempo real
2. **Adicionar autenticação** JWT/OAuth
3. **Integrar busca semântica** no Neo4j
4. **Implementar RAG** com embeddings
5. **Adicionar upload de arquivos**
6. **Criar dashboard** de monitoramento

## 📚 Referências

- [Agno Documentation](https://docs.agno.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

---

**Última atualização**: 2025-10-15

**Status**: ✅ Integração completa e funcional
