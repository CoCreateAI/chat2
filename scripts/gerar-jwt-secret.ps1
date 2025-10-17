# Script para gerar JWT Secret seguro

$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwt_secret = [System.Convert]::ToBase64String($bytes)

Write-Host "JWT Secret gerado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Copie e cole no seu arquivo .env:" -ForegroundColor Yellow
Write-Host ""
Write-Host "JWT_SECRET=$jwt_secret" -ForegroundColor Cyan
Write-Host ""

# Copiar para clipboard
$jwt_secret | Set-Clipboard
Write-Host "✓ JWT Secret copiado para a área de transferência!" -ForegroundColor Green
