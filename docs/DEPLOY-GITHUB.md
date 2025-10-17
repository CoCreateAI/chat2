# 🚀 Deploy para GitHub

## 📋 Pré-requisitos

Certifique-se de que o Git está instalado:
- Download: https://git-scm.com/download/win
- Ou use o Git Bash que vem com o GitHub Desktop

## 🔧 Comandos para Executar

Abra o **Git Bash** ou **PowerShell** e execute os comandos abaixo:

### 1. Navegue até o diretório do projeto
```bash
cd "c:\Users\rodrigo.trindade\Projetos\Chat\chat-template"
```

### 2. Inicialize o repositório Git (se ainda não foi feito)
```bash
git init
```

### 3. Configure seu usuário Git (se necessário)
```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### 4. Adicione o remote do GitHub
```bash
git remote add origin git@github.com:CoCreateAI/chat.git
```

### 5. Adicione todos os arquivos
```bash
git add .
```

### 6. Faça o commit inicial
```bash
git commit -m "feat: Chat template completo com histórico, KB e melhorias UX"
```

### 7. Verifique a branch atual
```bash
git branch
```

### 8. Renomeie para main se necessário
```bash
git branch -M main
```

### 9. Faça o push para o GitHub
```bash
git push -u origin main
```

Se o repositório já tem conteúdo (README, public), você pode precisar fazer:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 📦 O que está sendo enviado

Este projeto inclui:

- ✅ Chat colapsável/expansível
- ✅ Histórico de conversas com scroll
- ✅ Marcação de memória corporativa (KB)
- ✅ Dialog de confirmação para KB
- ✅ Feedback positivo/negativo
- ✅ Persistência de estado
- ✅ Header fixo
- ✅ Tooltips corrigidos
- ✅ Ícone elegante para KB (Archive)
- ✅ Responsivo e moderno
- ✅ Dark mode suportado

---

## 📁 Estrutura do Projeto

```
chat-template/
├── src/
│   ├── app/
│   │   └── page.tsx
│   ├── components/
│   │   ├── chatbot-panel-with-history.tsx
│   │   ├── conversation-history.tsx
│   │   ├── entity-mention.tsx
│   │   ├── markdown-renderer.tsx
│   │   └── ui/
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── command.tsx
│   │       ├── input.tsx
│   │       ├── popover.tsx
│   │       ├── scroll-area.tsx
│   │       └── tooltip.tsx
│   ├── hooks/
│   │   ├── use-chat.ts
│   │   └── use-conversations.ts
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── README.md
├── INSTALACAO.md
├── MELHORIAS-UX.md
├── CORRECAO-SCROLL-BOTOES.md
├── MELHORIA-ICONE-KB.md
├── CORRECOES-FINAL.md
└── LEIA-ME.txt
```

---

## ⚠️ Nota Importante

Se você já tem README e pasta `public` no repositório GitHub, o Git pode alertar sobre conflitos. Nesse caso:

### Opção 1: Mesclar com conteúdo existente
```bash
git pull origin main --allow-unrelated-histories
# Resolva conflitos se houver
git push origin main
```

### Opção 2: Sobrescrever (cuidado!)
```bash
git push origin main --force
```

**Recomendo a Opção 1** para preservar o README existente.

---

## 🔐 Autenticação SSH

Se você estiver usando SSH (`git@github.com`), certifique-se de que:

1. Sua chave SSH está configurada
2. A chave está adicionada ao GitHub
3. Teste a conexão:
```bash
ssh -T git@github.com
```

Se preferir HTTPS:
```bash
git remote set-url origin https://github.com/CoCreateAI/chat.git
```

---

## ✅ Verificação Final

Após o push, acesse:
```
https://github.com/CoCreateAI/chat
```

E verifique se todos os arquivos foram enviados corretamente!

---

## 📝 Mensagem de Commit Sugerida

```
feat: Chat template completo com histórico e memória corporativa

- Chat colapsável e expansível com redimensionamento
- Histórico de conversas com busca e scroll
- Sistema de marcação para Knowledge Base
- Dialog de confirmação para processos irreversíveis
- Feedback positivo/negativo nas respostas
- Persistência de estado no localStorage
- Tooltips reposicionados para evitar conflitos
- Ícone elegante Archive para memória corporativa
- Header fixo com z-index correto
- Dark mode completo
- Totalmente responsivo
```

---

**🎉 Pronto para deploy!**
