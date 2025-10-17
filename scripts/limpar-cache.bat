@echo off
echo ========================================
echo  Limpando Cache do Next.js
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Parando processos Node...
taskkill /F /IM node.exe 2>nul

echo.
echo [2/3] Removendo cache do Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache removido!
) else (
    echo Nenhum cache encontrado.
)

echo.
echo [3/3] Limpando node_modules/.cache (se existir)...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo Cache de node_modules removido!
)

echo.
echo ========================================
echo  Cache limpo! Reinicie o servidor:
echo  npm run dev
echo ========================================
echo.
pause
