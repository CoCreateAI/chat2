# CoCreateAI - Sistema de Chat Inteligente

Sistema de chat corporativo com integração Azure OpenAI, Neo4j e orquestração de agentes usando Agno Framework.

## 🎯 Visão Geral

O CoCreateAI é uma plataforma de chat inteligente que combina:
- **Frontend moderno** em Next.js 15 com interface responsiva
- **Backend robusto** em Python com Agno Framework para orquestração de agentes
- **Grafo de conhecimento** em Neo4j para contexto corporativo
- **LLM de ponta** com Azure OpenAI
- **Pipeline de ingestão** para alimentar o grafo com dados

## 📁 Estrutura do Projeto

```
CoCreateAI-Chat/
├── frontend/              # Aplicação Next.js
│   ├── src/
│   │   ├── app/          # Pages e layouts
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Custom hooks
│   │   └── services/     # Serviços de API
│   └── package.json
│
├── backend/              # API Python com Agno
│   ├── src/
│   │   ├── agents/       # Agentes Agno
│   │   ├── services/     # Serviços (Neo4j, etc)
│   │   ├── ingestion/    # Pipeline de ingestão
│   │   ├── config/       # Configurações
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
│
├── docs/                 # Documentação técnica
├── diagrams/             # Fluxogramas Mermaid
└── scripts/              # Scripts de automação
```

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 18+ (para frontend)
- **Python** 3.10+ (para backend)
- **Neo4j** Aura ou local
- **Azure OpenAI** API key

### 1. Configurar Variáveis de Ambiente

```bash
# Frontend
cp frontend/.env.example frontend/.env
# Edite frontend/.env com suas credenciais

# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais
```

### 2. Instalar Dependências

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 3. Executar o Projeto

**Backend (Terminal 1):**
```bash
cd backend
python -m src.main
# Rodará em http://localhost:8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# Rodará em http://localhost:3000
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🏗️ Arquitetura

O sistema utiliza uma arquitetura moderna de microserviços:

- **Frontend**: Next.js com Server Components e Client Components
- **Backend**: FastAPI com Agno Framework para orquestração de agentes
- **Database**: Neo4j para grafo de conhecimento
- **LLM**: Azure OpenAI para processamento de linguagem natural
- **Embeddings**: Azure OpenAI Embeddings para busca semântica

Veja os fluxogramas detalhados em [`diagrams/architecture.md`](./diagrams/architecture.md)

## 📚 Funcionalidades

### ✅ Implementadas

- **Chat Interface**: Interface moderna e responsiva
- **Histórico de Conversas**: Gerenciamento de múltiplas conversas
- **Sistema de Menções (@)**: Mencionar projetos, pessoas, processos e agentes
- **Gravação de Áudio**: Transcrição de voz para texto
- **Customização Visual**: Cores personalizáveis
- **Login/Autenticação**: Sistema de autenticação simples
- **Versão Mobile**: Interface otimizada para smartphones

### 🚧 Em Desenvolvimento

- **Pipeline de Ingestão**: Alimentar Neo4j com dados corporativos
- **Busca Semântica**: RAG com embeddings no Neo4j
- **Multi-agentes**: Orquestração de múltiplos agentes especializados
- **Memória Corporativa**: Knowledge Base persistente

## 🔧 Tecnologias

### Frontend
- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- shadcn/ui
- Lucide Icons

### Backend
- Python 3.10+
- Agno Framework
- FastAPI
- Neo4j Driver
- Azure OpenAI SDK
- Pydantic

## 📖 Documentação

- **[Documentação Completa](./docs/)**: Guias técnicos detalhados
- **[Arquitetura e Fluxogramas](./diagrams/architecture.md)**: Diagramas Mermaid
- **[README Frontend](./frontend/README.md)**: Específico do frontend
- **[README Backend](./backend/README.md)**: Específico do backend

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - use como quiser!

## 🔗 Links Úteis

- [Agno Framework](https://github.com/agno-agi/agno)
- [Neo4j Documentation](https://neo4j.com/docs/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Desenvolvido com ❤️ pela equipe CoCreateAI**
