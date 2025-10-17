# Deploy no Azure direto do GitHub (Método Mais Simples!)

Este é o método mais fácil - o Azure vai buildar e fazer deploy automaticamente do seu repositório GitHub.

## 🎯 Vantagens deste Método

- ✅ Não precisa Docker Hub
- ✅ Não precisa fazer push manual de imagens
- ✅ Deploy automático a cada push no GitHub
- ✅ Tudo pelo portal do Azure

## 📋 Passo a Passo

### 1. Criar Web App no Azure Portal

1. Acesse: https://portal.azure.com
2. Clique em **"Create a resource"**
3. Procure por **"Web App"**
4. Clique em **"Create"**

### 2. Configurar o Web App

**Basics:**
- **Subscription**: Sua assinatura Azure
- **Resource Group**: Criar novo → `chat-rg`
- **Name**: `chat-backend-api` (será: chat-backend-api.azurewebsites.net)
- **Publish**: **Code** (não Docker!)
- **Runtime stack**: **Python 3.11**
- **Operating System**: **Linux**
- **Region**: **Brazil South**
- **Pricing Plan**: **Basic B1** (~$13/mês) ou **Free F1** (teste)

Clique em **"Next: Deployment"**

### 3. Configurar GitHub Deployment

**GitHub:**
- **Continuous deployment**: **Enable**
- **GitHub account**: Conecte sua conta GitHub
- **Organization**: `CoCreateAI`
- **Repository**: `chat2`
- **Branch**: `main`

Clique em **"Review + create"**

### 4. Configurar Startup Command

Após criar, vá em:
1. **Configuration** (menu lateral)
2. **General settings**
3. **Startup Command**: 
```bash
cd backend && pip install -r requirements.txt && uvicorn src.main:app --host 0.0.0.0 --port 8000
```
4. Clique em **Save**

### 5. Configurar Variáveis de Ambiente

Ainda em **Configuration**:
1. Clique em **Application settings**
2. Adicione cada variável:

```
NEO4J_URI = neo4j+s://seu-neo4j.databases.neo4j.io
NEO4J_USERNAME = neo4j
NEO4J_PASSWORD = sua-senha
NEO4J_DATABASE = neo4j
AZURE_OPENAI_ENDPOINT = https://seu-openai.openai.azure.com/
AZURE_OPENAI_KEY = sua-chave
AZURE_OPENAI_DEPLOYMENT_NAME = seu-deployment
AZURE_OPENAI_EMBEDDINGS_ENDPOINT = https://seu-openai.openai.azure.com/
AZURE_OPENAI_EMBEDDINGS_KEY = sua-chave
AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME = text-embedding-3-small
```

3. Clique em **Save**

### 6. Testar

1. Vá em **Overview**
2. Copie a **URL**
3. Acesse: `https://chat-backend-api.azurewebsites.net/health`

Deve retornar: `{"status":"healthy"}`

## 🔄 Deploy Automático

Agora, toda vez que você fizer `git push`, o Azure vai:
1. Detectar a mudança
2. Buildar automaticamente
3. Fazer deploy
4. Reiniciar a aplicação

## 📊 Ver Progresso do Deploy

1. No Web App, vá em **Deployment Center**
2. Veja os logs de cada deploy
3. Acompanhe o status

## 🔍 Ver Logs da Aplicação

1. Vá em **Log stream** (menu lateral)
2. Veja os logs em tempo real
3. Debug erros facilmente

## ⚠️ Troubleshooting

**Erro "Application Error":**
- Veja os logs no Log stream
- Verifique o Startup Command
- Certifique-se que as variáveis de ambiente estão corretas

**Erro de dependências:**
- Verifique se `requirements.txt` está correto
- Veja os logs de build no Deployment Center

**Timeout no startup:**
- O Free tier tem limitações
- Considere usar Basic B1

## 💡 Dica Pro

Para desenvolvimento mais rápido, use o método Docker local e só faça deploy no Azure quando estiver pronto para produção.

## 🎉 Pronto!

Seu backend está no Azure com deploy automático do GitHub! 🚀
