@echo off
echo ========================================
echo  Push Completo para GitHub
echo  Incluindo todos os arquivos novos
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando status...
git status

echo.
echo [2/5] Adicionando TODOS os arquivos (novos e modificados)...
git add .

echo.
echo [3/5] Criando commit com todas as alteracoes...
git commit -m "feat: Login, customizacao de cores e integracao completa

- Sistema de autenticacao simples (email/senha)
- Upload de foto de perfil
- 2 cores customizaveis (primaria e secundaria)
- Cores integradas no chat (mensagens, avatares, badges)
- Pagina de configuracoes (/settings)
- Guia para desenvolvedores (GUIA-CORES-CUSTOMIZAVEIS.md)
- Documentacao completa (LOGIN-E-CUSTOMIZACAO.md)
- Script de limpeza de cache
- Correcoes de acessibilidade (DialogTitle)"

echo.
echo [4/5] Puxando ultimas mudancas (se houver)...
git pull origin main --no-edit 2>nul

echo.
echo [5/5] Enviando para GitHub...
git push origin main

echo.
echo ========================================
echo  Push Completo Concluido!
echo ========================================
echo.
echo Arquivos enviados:
echo - src/contexts/auth-context.tsx
echo - src/contexts/theme-context.tsx
echo - src/app/login/page.tsx
echo - src/app/settings/page.tsx
echo - src/components/user-menu.tsx
echo - src/components/protected-route.tsx
echo - src/components/chatbot-panel-with-history.tsx (atualizado)
echo - src/app/layout.tsx (atualizado)
echo - src/app/page.tsx (atualizado)
echo - src/app/globals.css (atualizado)
echo - LOGIN-E-CUSTOMIZACAO.md
echo - GUIA-CORES-CUSTOMIZAVEIS.md
echo - limpar-cache.bat
echo - E mais...
echo.
echo Acesse: https://github.com/CoCreateAI/chat
echo.
pause
