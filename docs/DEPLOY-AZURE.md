# Deploy no Azure com Docker

Este guia explica como fazer o deploy da aplicação no Azure usando Docker e Azure Container Instances ou Azure App Service.

## 📋 Pré-requisitos

- Docker instalado localmente
- Conta no Azure
- Azure CLI instalado
- Variáveis de ambiente configuradas

## 🐳 Opção 1: Azure Container Registry + Container Instances

### 1. Criar Azure Container Registry

```bash
# Login no Azure
az login

# Criar resource group
az group create --name chat-rg --location brazilsouth

# Criar container registry
az acr create --resource-group chat-rg --name chatregistry --sku Basic

# Habilitar admin
az acr update -n chatregistry --admin-enabled true

# Login no registry
az acr login --name chatregistry
```

### 2. Build e Push das Imagens

```bash
# Build backend
docker build -t chatregistry.azurecr.io/chat-backend:latest ./backend

# Build frontend
docker build -t chatregistry.azurecr.io/chat-frontend:latest ./frontend

# Push backend
docker push chatregistry.azurecr.io/chat-backend:latest

# Push frontend
docker push chatregistry.azurecr.io/chat-frontend:latest
```

### 3. Deploy no Azure Container Instances

```bash
# Obter credenciais do registry
ACR_USERNAME=$(az acr credential show --name chatregistry --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name chatregistry --query passwords[0].value -o tsv)

# Deploy backend
az container create \
  --resource-group chat-rg \
  --name chat-backend \
  --image chatregistry.azurecr.io/chat-backend:latest \
  --registry-login-server chatregistry.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label chat-backend-api \
  --ports 8000 \
  --environment-variables \
    NEO4J_URI=$NEO4J_URI \
    NEO4J_USER=$NEO4J_USER \
    NEO4J_PASSWORD=$NEO4J_PASSWORD \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    JWT_SECRET=$JWT_SECRET

# Deploy frontend
az container create \
  --resource-group chat-rg \
  --name chat-frontend \
  --image chatregistry.azurecr.io/chat-frontend:latest \
  --registry-login-server chatregistry.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label chat-frontend-app \
  --ports 3000 \
  --environment-variables \
    NEXT_PUBLIC_API_URL=http://chat-backend-api.brazilsouth.azurecontainer.io:8000
```

## 🚀 Opção 2: Azure App Service (Web App for Containers)

### 1. Criar App Service Plan

```bash
az appservice plan create \
  --name chat-plan \
  --resource-group chat-rg \
  --is-linux \
  --sku B1
```

### 2. Criar Web Apps

```bash
# Backend
az webapp create \
  --resource-group chat-rg \
  --plan chat-plan \
  --name chat-backend-api \
  --deployment-container-image-name chatregistry.azurecr.io/chat-backend:latest

# Configurar registry
az webapp config container set \
  --name chat-backend-api \
  --resource-group chat-rg \
  --docker-custom-image-name chatregistry.azurecr.io/chat-backend:latest \
  --docker-registry-server-url https://chatregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Configurar variáveis de ambiente
az webapp config appsettings set \
  --resource-group chat-rg \
  --name chat-backend-api \
  --settings \
    NEO4J_URI=$NEO4J_URI \
    NEO4J_USER=$NEO4J_USER \
    NEO4J_PASSWORD=$NEO4J_PASSWORD \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    JWT_SECRET=$JWT_SECRET

# Frontend
az webapp create \
  --resource-group chat-rg \
  --plan chat-plan \
  --name chat-frontend-app \
  --deployment-container-image-name chatregistry.azurecr.io/chat-frontend:latest

# Configurar registry
az webapp config container set \
  --name chat-frontend-app \
  --resource-group chat-rg \
  --docker-custom-image-name chatregistry.azurecr.io/chat-frontend:latest \
  --docker-registry-server-url https://chatregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Configurar variáveis de ambiente
az webapp config appsettings set \
  --resource-group chat-rg \
  --name chat-frontend-app \
  --settings \
    NEXT_PUBLIC_API_URL=https://chat-backend-api.azurewebsites.net
```

## 🔄 Atualizar Aplicação

```bash
# Rebuild e push
docker build -t chatregistry.azurecr.io/chat-backend:latest ./backend
docker push chatregistry.azurecr.io/chat-backend:latest

# Reiniciar container (Container Instances)
az container restart --name chat-backend --resource-group chat-rg

# Ou reiniciar Web App
az webapp restart --name chat-backend-api --resource-group chat-rg
```

## 📝 Variáveis de Ambiente Necessárias

Crie um arquivo `.env` com:

```env
NEO4J_URI=neo4j+s://seu-neo4j.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=sua-senha
OPENAI_API_KEY=sk-...
JWT_SECRET=sua-chave-secreta-jwt
NEXT_PUBLIC_API_URL=https://chat-backend-api.azurewebsites.net
```

## 🧪 Testar Localmente com Docker

```bash
# Copiar .env.example para .env e preencher
cp .env.example .env

# Subir com docker-compose
docker-compose up --build

# Acessar:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🔍 Monitoramento

```bash
# Ver logs do container
az container logs --name chat-backend --resource-group chat-rg

# Ou logs do Web App
az webapp log tail --name chat-backend-api --resource-group chat-rg
```

## 💰 Custos Estimados

- **Container Instances**: ~$15-30/mês (B1)
- **App Service**: ~$13/mês (B1)
- **Container Registry**: ~$5/mês (Basic)

**Total estimado**: $23-40/mês
