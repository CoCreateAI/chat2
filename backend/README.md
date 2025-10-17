# Backend - CoCreateAI

Backend da aplicação CoCreateAI usando Agno Framework, FastAPI, Azure OpenAI e Neo4j.

## 🏗️ Arquitetura

```
backend/
├── src/
│   ├── agents/           # Agentes Agno
│   │   └── chat_agent.py # Agente principal de chat
│   ├── services/         # Serviços externos
│   │   └── neo4j_service.py # Conexão Neo4j
│   ├── ingestion/        # Pipeline de ingestão
│   │   └── pipeline.py   # Pipeline principal
│   ├── config/           # Configurações
│   │   └── settings.py   # Settings com Pydantic
│   ├── models/           # Modelos de dados
│   └── main.py           # FastAPI application
├── requirements.txt      # Dependências Python
└── .env.example         # Exemplo de variáveis
```

## 🚀 Setup

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
# Neo4j
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEO4J_DATABASE=neo4j

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-07-18

# Azure Embeddings
AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME=text-embedding-3-small
AZURE_OPENAI_EMBEDDINGS_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_EMBEDDINGS_KEY=your-api-key
AZURE_OPENAI_EMBEDDINGS_DIMENSIONS=1536
```

### 3. Executar o Servidor

```bash
# Modo desenvolvimento (com reload)
python -m src.main

# Ou usando uvicorn diretamente
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Chat
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Olá, como você pode me ajudar?",
  "session_id": "optional-session-id",
  "context": {}
}
```

### Ingestão de Documento
```http
POST /api/ingest/document
Content-Type: application/json

{
  "document": {
    "id": "doc-123",
    "title": "Documento Exemplo",
    "content": "Conteúdo do documento..."
  },
  "document_type": "Document"
}
```

### Ingestão de Conversa
```http
POST /api/ingest/conversation
Content-Type: application/json

{
  "conversation_id": "conv-123",
  "messages": [
    {
      "role": "user",
      "content": "Pergunta",
      "timestamp": "2025-10-15T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Resposta",
      "timestamp": "2025-10-15T10:00:05Z"
    }
  ],
  "metadata": {
    "user_id": "user-123"
  }
}
```

### Criar Entidade
```http
POST /api/entity
Content-Type: application/json

{
  "entity_type": "Project",
  "properties": {
    "id": "proj-123",
    "name": "Projeto Exemplo",
    "description": "Descrição do projeto"
  }
}
```

### Criar Relacionamento
```http
POST /api/relationship
Content-Type: application/json

{
  "from_type": "Person",
  "from_id": "person-123",
  "to_type": "Project",
  "to_id": "proj-123",
  "relationship_type": "WORKS_ON",
  "properties": {
    "role": "Developer",
    "since": "2025-01-01"
  }
}
```

## 🤖 Agno Framework

O backend utiliza o [Agno Framework](https://github.com/agno-agi/agno) para orquestração de agentes.

### Chat Agent

O agente principal (`chat_agent.py`) é configurado com:

- **Modelo**: Azure OpenAI (GPT-4)
- **Database**: SQLite para histórico
- **Contexto**: Neo4j para conhecimento corporativo
- **Instruções**: Personalizadas para o domínio

### Exemplo de Uso

```python
from src.agents.chat_agent import chat_agent

# Enviar mensagem
response = await chat_agent.chat(
    message="Qual o status do projeto X?",
    session_id="user-123"
)

print(response)
```

## 🗄️ Neo4j

### Estrutura do Grafo

```cypher
// Nós principais
(:User)
(:Conversation)
(:Message)
(:Project)
(:Process)
(:Person)
(:Agent)
(:Document)

// Relacionamentos
(:User)-[:HAS_CONVERSATION]->(:Conversation)
(:Conversation)-[:HAS_MESSAGE]->(:Message)
(:Message)-[:MENTIONS]->(:Project|:Person|:Process)
(:Project)-[:HAS_PROCESS]->(:Process)
(:Process)-[:ASSIGNED_TO]->(:Person)
(:Document)-[:RELATED_TO]->(:Project)
```

### Queries Úteis

```cypher
// Buscar conversas de um usuário
MATCH (u:User {id: $user_id})-[:HAS_CONVERSATION]->(c:Conversation)
RETURN c

// Buscar projetos mencionados em conversas
MATCH (c:Conversation)-[:HAS_MESSAGE]->(m:Message)-[:MENTIONS]->(p:Project)
RETURN DISTINCT p

// Buscar pessoas trabalhando em um projeto
MATCH (proj:Project {id: $project_id})<-[:WORKS_ON]-(person:Person)
RETURN person
```

## 🔧 Desenvolvimento

### Adicionar Novo Agente

1. Criar arquivo em `src/agents/novo_agente.py`
2. Implementar classe do agente usando Agno
3. Registrar no `main.py`

```python
from agno.agent import Agent
from agno.models.azure import AzureOpenAIChat

class NovoAgente:
    def __init__(self):
        self.agent = Agent(
            name="Novo Agente",
            model=AzureOpenAIChat(...),
            instructions=["Instruções específicas"]
        )
```

### Adicionar Novo Endpoint

```python
@app.post("/api/novo-endpoint")
async def novo_endpoint(request: NovoRequest):
    # Implementação
    return {"result": "success"}
```

## 🧪 Testes

```bash
# Instalar dependências de teste
pip install pytest pytest-asyncio httpx

# Rodar testes
pytest
```

## 📊 Monitoramento

### Logs

Os logs são configurados com `logging`:

```python
import logging
logger = logging.getLogger(__name__)
logger.info("Mensagem de log")
```

### Health Check

```bash
curl http://localhost:8000/health
```

## 🔐 Segurança

- Variáveis sensíveis em `.env` (nunca commitar)
- CORS configurado para origens específicas
- Validação de entrada com Pydantic
- Conexões seguras com Neo4j e Azure

## 📚 Recursos

- [Agno Documentation](https://docs.agno.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Neo4j Python Driver](https://neo4j.com/docs/python-manual/current/)
- [Azure OpenAI Python SDK](https://github.com/openai/openai-python)

---

**Desenvolvido com Agno Framework 🚀**
