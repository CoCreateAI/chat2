# Deploy no Azure via Portal (Guia Simplificado)

Este guia mostra como fazer o deploy do backend usando apenas o Portal do Azure (sem linha de comando).

## 🎯 Método Recomendado: Azure Web App for Containers

### Passo 1: Preparar a Imagem Docker Localmente

```powershell
# 1. Fazer login no Docker Hub (ou criar conta em hub.docker.com)
docker login

# 2. Criar tag da imagem com seu usuário Docker Hub
docker tag chat-backend SEU_USUARIO_DOCKERHUB/chat-backend:latest

# 3. Fazer push para Docker Hub
docker push SEU_USUARIO_DOCKERHUB/chat-backend:latest
```

### Passo 2: Criar Web App no Portal Azure

1. **Acesse**: https://portal.azure.com
2. **Clique em**: "Create a resource"
3. **Procure por**: "Web App"
4. **Clique em**: "Create"

### Passo 3: Configurar o Web App

**Basics:**
- **Subscription**: Escolha sua assinatura
- **Resource Group**: Crie novo "chat-rg"
- **Name**: `chat-backend-api` (será: chat-backend-api.azurewebsites.net)
- **Publish**: `Docker Container`
- **Operating System**: `Linux`
- **Region**: `Brazil South` (ou mais próximo)
- **Pricing Plan**: `Basic B1` (~$13/mês) ou `Free F1` (para teste)

**Docker:**
- **Options**: `Single Container`
- **Image Source**: `Docker Hub`
- **Access Type**: `Public`
- **Image and tag**: `SEU_USUARIO_DOCKERHUB/chat-backend:latest`

### Passo 4: Configurar Variáveis de Ambiente

Após criar o Web App:

1. Vá em **Configuration** (menu lateral)
2. Clique em **New application setting**
3. Adicione cada variável:

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
```

4. Clique em **Save**
5. Clique em **Continue** para reiniciar

### Passo 5: Testar

1. Vá em **Overview**
2. Copie a **URL** (ex: https://chat-backend-api.azurewebsites.net)
3. Teste no navegador: `https://chat-backend-api.azurewebsites.net/health`

Deve retornar: `{"status":"healthy"}`

## 🔄 Atualizar a Aplicação

Quando fizer mudanças:

```powershell
# 1. Rebuild local
docker-compose -f docker-compose.dev.yml build

# 2. Tag e push
docker tag chat-backend SEU_USUARIO_DOCKERHUB/chat-backend:latest
docker push SEU_USUARIO_DOCKERHUB/chat-backend:latest

# 3. No Portal Azure:
# - Vá no Web App
# - Clique em "Restart"
```

## 💰 Custos Estimados

- **Free F1**: Grátis (limitado)
- **Basic B1**: ~$13/mês
- **Standard S1**: ~$70/mês (produção)

## 🔍 Ver Logs

No Portal Azure:
1. Vá no Web App
2. **Log stream** (menu lateral)
3. Veja os logs em tempo real

## ⚠️ Troubleshooting

**Erro "Container didn't respond":**
- Verifique as variáveis de ambiente
- Veja os logs no Log stream
- Certifique-se que a porta 8000 está exposta

**Erro de autenticação Neo4j:**
- Verifique NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
- Teste a conexão localmente primeiro

**Imagem não encontrada:**
- Verifique se fez push para Docker Hub
- Certifique-se que a imagem é pública
- Verifique o nome da imagem no Web App

## 🎉 Pronto!

Seu backend está no ar! URL: `https://chat-backend-api.azurewebsites.net`

Agora você pode:
1. Configurar o frontend para usar essa URL
2. Adicionar domínio customizado
3. Configurar SSL/HTTPS (já vem por padrão)
4. Configurar CI/CD com GitHub Actions
