# Guia de Inicialização - CoCreateAI

Guia completo para configurar e executar o projeto pela primeira vez.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/))
- **Neo4j Aura** ou Neo4j Desktop ([Neo4j Aura](https://neo4j.com/cloud/aura/))
- **Azure OpenAI** com credenciais configuradas

## 🚀 Passo a Passo

### 1. Clonar/Navegar para o Projeto

```bash
cd "c:\MINHAS PASTAS\COCREATEAI\PROJETOS\chat"
```

### 2. Configurar Backend (Python)

#### 2.1. Criar Ambiente Virtual

```bash
# Navegar para pasta backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Você verá (venv) no início da linha do terminal
```

> **Importante**: Sempre ative o ambiente virtual antes de trabalhar no backend!

#### 2.2. Instalar Dependências Python

```bash
# Com o ambiente virtual ativado
pip install -r requirements.txt
```

Isso instalará:
- Agno Framework
- FastAPI e Uvicorn
- Neo4j Driver
- Azure OpenAI SDK
- Pydantic e outras dependências

#### 2.3. Verificar Instalação

```bash
pip list
```

Você deve ver todas as dependências listadas.

#### 2.4. Configurar Variáveis de Ambiente

O arquivo `.env` já deve estar configurado com suas credenciais. Verifique se contém:

```env
# Neo4j
NEO4J_URI=neo4j+s://seu-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=sua-senha
NEO4J_DATABASE=neo4j

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://seu-resource.openai.azure.com/
AZURE_OPENAI_KEY=sua-chave
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-07-18

# Azure Embeddings
AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME=text-embedding-3-small
AZURE_OPENAI_EMBEDDINGS_ENDPOINT=https://seu-resource.openai.azure.com/
AZURE_OPENAI_EMBEDDINGS_KEY=sua-chave
AZURE_OPENAI_EMBEDDINGS_DIMENSIONS=1536

# Server
HOST=0.0.0.0
PORT=8000
RELOAD=True

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### 2.5. Executar Backend

```bash
# Com ambiente virtual ativado, na pasta backend
python -m src.main
```

Você verá:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Testar**: Abra http://localhost:8000/health no navegador

### 3. Configurar Frontend (Next.js)

#### 3.1. Abrir Novo Terminal

Mantenha o backend rodando e abra um **novo terminal**.

#### 3.2. Navegar para Frontend

```bash
cd "c:\MINHAS PASTAS\COCREATEAI\PROJETOS\chat\frontend"
```

#### 3.3. Instalar Dependências Node.js

```bash
npm install
```

Isso pode levar alguns minutos na primeira vez.

#### 3.4. Verificar Variáveis de Ambiente

O arquivo `frontend/.env` já deve estar configurado com a URL do backend:

```env
# Backend API - OBRIGATÓRIO
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Importante**: O frontend agora está integrado com o backend Agno. Certifique-se de que:
> - O backend está rodando em `http://localhost:8000`
> - A variável `NEXT_PUBLIC_API_URL` está configurada corretamente

#### 3.5. Executar Frontend

```bash
npm run dev
```

Você verá:
```
  ▲ Next.js 15.4.7
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

**Testar**: Abra http://localhost:3000 no navegador

## 🎯 Verificação Final

Com ambos os servidores rodando:

### Backend (Terminal 1)
```
✅ http://localhost:8000 - API rodando
✅ http://localhost:8000/docs - Documentação Swagger
✅ http://localhost:8000/health - Health check
```

### Frontend (Terminal 2)
```
✅ http://localhost:3000 - Chat desktop
✅ http://localhost:3000/m - Chat mobile
✅ http://localhost:3000/login - Login
✅ http://localhost:3000/settings - Configurações
```

## 🔄 Rotina Diária de Desenvolvimento

### Iniciar Backend

```bash
# Terminal 1
cd backend
venv\Scripts\activate  # Ativar ambiente virtual
python -m src.main
```

### Iniciar Frontend

```bash
# Terminal 2
cd frontend
npm run dev
```

## 🛠️ Comandos Úteis

### Backend

```bash
# Desativar ambiente virtual
deactivate

# Atualizar dependências
pip install --upgrade -r requirements.txt

# Adicionar nova dependência
pip install nome-do-pacote
pip freeze > requirements.txt

# Rodar com reload automático
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Build para produção
npm run build

# Executar build de produção
npm start

# Limpar cache do Next.js
rm -rf .next

# Adicionar nova dependência
npm install nome-do-pacote

# Adicionar componente shadcn/ui
npx shadcn@latest add button
```

## 🐛 Troubleshooting

### Backend não inicia

**Erro: "Module not found"**
```bash
# Certifique-se que o ambiente virtual está ativado
venv\Scripts\activate

# Reinstale as dependências
pip install -r requirements.txt
```

**Erro: "Connection refused" (Neo4j)**
- Verifique se as credenciais do Neo4j estão corretas no `.env`
- Teste a conexão no Neo4j Browser

**Erro: "Invalid API Key" (Azure)**
- Verifique se a chave da Azure está correta no `.env`
- Verifique se o endpoint está correto

### Frontend não inicia

**Erro: "Port 3000 already in use"**
```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
npm run dev -- -p 3001
```

**Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Erro: "Cannot connect to backend"**
- Verifique se o backend está rodando em http://localhost:8000
- Verifique se `NEXT_PUBLIC_API_URL` está correto no `.env`

### Ambiente Virtual não ativa

**Windows PowerShell - Erro de Execução**
```powershell
# Executar como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Depois ativar normalmente
venv\Scripts\activate
```

## 📊 Estrutura de Pastas para Desenvolvimento

```
chat/
├── backend/
│   ├── venv/              # ⚠️ Ambiente virtual (não commitar)
│   ├── src/               # Código fonte
│   ├── .env               # ⚠️ Credenciais (não commitar)
│   └── requirements.txt   # Dependências
│
└── frontend/
    ├── node_modules/      # ⚠️ Dependências (não commitar)
    ├── .next/             # ⚠️ Build (não commitar)
    ├── src/               # Código fonte
    ├── .env               # ⚠️ Credenciais (não commitar)
    └── package.json       # Dependências
```

## 🔐 Segurança

- ✅ Nunca commitar arquivos `.env`
- ✅ Nunca commitar `venv/` ou `node_modules/`
- ✅ Usar `.gitignore` para proteger credenciais
- ✅ Rotacionar chaves regularmente

## 📚 Próximos Passos

Após inicializar com sucesso:

1. **Testar o Chat**: Envie uma mensagem em http://localhost:3000
2. **Explorar a API**: Acesse http://localhost:8000/docs
3. **Configurar Neo4j**: Crie os primeiros nós e relacionamentos
4. **Personalizar**: Ajuste cores em http://localhost:3000/settings
5. **Desenvolver**: Comece a adicionar novas funcionalidades!

## 🆘 Precisa de Ajuda?

- **Documentação Backend**: `backend/README.md`
- **Documentação Frontend**: `frontend/README.md`
- **Arquitetura**: `diagrams/architecture.md`
- **Documentação Técnica**: `docs/`

---

**Última atualização**: 2025-10-15

**Dica**: Mantenha sempre 2 terminais abertos - um para backend e outro para frontend!
