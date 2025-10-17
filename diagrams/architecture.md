# Arquitetura e Fluxogramas do Sistema CoCreateAI

Este documento contém os fluxogramas e diagramas de arquitetura do sistema CoCreateAI usando Mermaid.

## 1. Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Frontend - Next.js"
        UI[Interface do Usuário]
        Chat[Componente Chat]
        Auth[Sistema de Login]
        Settings[Configurações]
    end
    
    subgraph "Backend - Python/Agno"
        API[FastAPI Server]
        Agent[Chat Agent - Agno]
        Pipeline[Pipeline de Ingestão]
        Neo4jService[Serviço Neo4j]
    end
    
    subgraph "Serviços Externos"
        Azure[Azure OpenAI]
        Neo4j[(Neo4j Database)]
        Embeddings[Azure Embeddings]
    end
    
    UI --> Chat
    Chat --> API
    Auth --> API
    Settings --> API
    
    API --> Agent
    API --> Pipeline
    
    Agent --> Azure
    Agent --> Neo4jService
    Pipeline --> Neo4jService
    
    Neo4jService --> Neo4j
    Agent --> Embeddings
```

## 2. Fluxo de Chat

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend (Next.js)
    participant Backend as Backend API
    participant Agent as Chat Agent (Agno)
    participant Azure as Azure OpenAI
    participant Neo4j as Neo4j Database
    
    User->>Frontend: Envia mensagem
    Frontend->>Backend: POST /api/chat
    Backend->>Agent: Processa mensagem
    
    Agent->>Neo4j: Busca contexto relevante
    Neo4j-->>Agent: Retorna contexto
    
    Agent->>Azure: Envia prompt + contexto
    Azure-->>Agent: Retorna resposta
    
    Agent->>Neo4j: Salva conversa (opcional)
    Agent-->>Backend: Retorna resposta
    Backend-->>Frontend: JSON response
    Frontend-->>User: Exibe resposta
```

## 3. Pipeline de Ingestão de Dados

```mermaid
flowchart TD
    Start[Início da Ingestão] --> Type{Tipo de Dados?}
    
    Type -->|Documento| Doc[Processar Documento]
    Type -->|Conversa| Conv[Processar Conversa]
    Type -->|Entidade| Ent[Processar Entidade]
    
    Doc --> Extract[Extrair Metadados]
    Extract --> Embed[Gerar Embeddings]
    Embed --> CreateNode[Criar Nó no Neo4j]
    
    Conv --> ParseMsg[Parsear Mensagens]
    ParseMsg --> CreateConv[Criar Nó Conversa]
    CreateConv --> CreateMsgs[Criar Nós Mensagens]
    CreateMsgs --> LinkMsgs[Criar Relacionamentos]
    
    Ent --> Validate[Validar Dados]
    Validate --> CreateEnt[Criar Nó Entidade]
    CreateEnt --> LinkEnt[Criar Relacionamentos]
    
    CreateNode --> End[Fim]
    LinkMsgs --> End
    LinkEnt --> End
```

## 4. Estrutura do Grafo Neo4j

```mermaid
graph LR
    User((User)) -->|HAS_CONVERSATION| Conv((Conversation))
    Conv -->|HAS_MESSAGE| Msg1((Message))
    Conv -->|HAS_MESSAGE| Msg2((Message))
    
    Msg1 -->|MENTIONS| Project((Project))
    Msg1 -->|MENTIONS| Person((Person))
    
    Project -->|HAS_PROCESS| Process((Process))
    Process -->|ASSIGNED_TO| Person
    
    Agent((Agent)) -->|RESPONDS_IN| Conv
    
    Doc((Document)) -->|RELATED_TO| Project
    Doc -->|EMBEDDED_AS| Vector[Vector Embedding]
```

## 5. Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant Backend as Backend API
    participant DB as Database
    
    User->>Frontend: Acessa /login
    User->>Frontend: Insere credenciais
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Valida credenciais
    DB-->>Backend: Credenciais válidas
    Backend-->>Frontend: Token JWT
    Frontend->>Frontend: Armazena token
    Frontend-->>User: Redireciona para chat
```

## 6. Sistema de Menções (@)

```mermaid
flowchart TD
    Input[Usuário digita @] --> Detect[Detectar menção]
    Detect --> Search[Buscar entidades]
    Search --> Neo4j[(Neo4j)]
    Neo4j --> Results[Retornar resultados]
    Results --> Display[Exibir sugestões]
    Display --> Select[Usuário seleciona]
    Select --> AddContext[Adicionar ao contexto]
    AddContext --> SendMsg[Enviar mensagem]
    SendMsg --> Agent[Processar com agente]
```

## 7. Fluxo de Customização Visual

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Settings as Página Settings
    participant ColorPicker as Seletor de Cores
    participant Preview as Preview
    participant Storage as LocalStorage
    
    User->>Settings: Acessa /settings
    Settings->>Storage: Carrega cores salvas
    Storage-->>Settings: Cores atuais
    
    User->>ColorPicker: Seleciona cor primária
    ColorPicker->>Preview: Atualiza preview
    
    User->>ColorPicker: Seleciona cor secundária
    ColorPicker->>Preview: Atualiza preview
    
    User->>Settings: Clica em "Salvar"
    Settings->>Storage: Salva cores
    Settings->>Settings: Aplica CSS variables
    Settings-->>User: Confirmação
```

## Notas de Implementação

### Tecnologias Utilizadas
- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Python, Agno Framework, FastAPI
- **Database**: Neo4j (Aura)
- **LLM**: Azure OpenAI
- **Embeddings**: Azure OpenAI Embeddings

### Próximos Fluxos a Documentar
- [ ] Fluxo de gravação de áudio
- [ ] Fluxo de busca semântica
- [ ] Fluxo de RAG (Retrieval Augmented Generation)
- [ ] Fluxo de multi-agentes
- [ ] Fluxo de memória corporativa (KB)

---

**Última atualização**: 2025-10-15
