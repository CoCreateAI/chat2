"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Palette, RotateCcw, Check } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { colors, updateColors, resetColors } = useTheme()
  const router = useRouter()

  const [primaryColor, setPrimaryColor] = useState(colors.primary)
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    setPrimaryColor(colors.primary)
    setSecondaryColor(colors.secondary)
  }, [colors])

  // Converter RGB para Hex
  const rgbToHex = (rgb: string): string | null => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (match) {
      const r = parseInt(match[1])
      const g = parseInt(match[2])
      const b = parseInt(match[3])
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
    }
    return null
  }

  // Validar e normalizar cor
  const normalizeColor = (value: string): string | null => {
    const cleaned = value.trim()
    
    // Hex: #RRGGBB ou #RGB
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleaned)) {
      if (cleaned.length === 4) {
        // Expandir #RGB para #RRGGBB
        return '#' + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2] + cleaned[3] + cleaned[3]
      }
      return cleaned.toUpperCase()
    }
    
    // RGB: rgb(r, g, b)
    if (/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(cleaned)) {
      return rgbToHex(cleaned)
    }
    
    return null
  }

  const handlePrimaryChange = (value: string) => {
    setPrimaryColor(value)
    const normalized = normalizeColor(value)
    if (normalized) {
      updateColors({ primary: normalized })
    }
  }

  const handleSecondaryChange = (value: string) => {
    setSecondaryColor(value)
    const normalized = normalizeColor(value)
    if (normalized) {
      updateColors({ secondary: normalized })
    }
  }

  const handleSave = () => {
    const normalizedPrimary = normalizeColor(primaryColor)
    const normalizedSecondary = normalizeColor(secondaryColor)
    
    if (normalizedPrimary && normalizedSecondary) {
      updateColors({
        primary: normalizedPrimary,
        secondary: normalizedSecondary
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      alert('Formato de cor inválido. Use #RRGGBB ou rgb(r, g, b)')
    }
  }

  const handleReset = () => {
    if (confirm('Deseja restaurar as cores padrão?')) {
      resetColors()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Personalização de Cores */}
        <section className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5 text-[var(--color-primary-custom,oklch(0.205_0_0))]" />
            <h2 className="text-lg font-semibold text-foreground">Identidade Visual</h2>
          </div>

          <div className="space-y-6">
            {/* Cor Primária */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cor Primária
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Usada em botões, links e destaques principais
              </p>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    placeholder="#000000 ou rgb(0, 0, 0)"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: <code className="bg-muted px-1 py-0.5 rounded">#RRGGBB</code> ou <code className="bg-muted px-1 py-0.5 rounded">rgb(r, g, b)</code>
                  </p>
                </div>
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: normalizeColor(primaryColor) || colors.primary }}
                />
              </div>
            </div>

            {/* Cor Secundária */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cor Secundária
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Usada em badges, cards e elementos de suporte
              </p>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    value={secondaryColor}
                    onChange={(e) => handleSecondaryChange(e.target.value)}
                    placeholder="#6b7280 ou rgb(107, 114, 128)"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: <code className="bg-muted px-1 py-0.5 rounded">#RRGGBB</code> ou <code className="bg-muted px-1 py-0.5 rounded">rgb(r, g, b)</code>
                  </p>
                </div>
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: normalizeColor(secondaryColor) || colors.secondary }}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="border border-border rounded-lg p-4 bg-background">
              <p className="text-sm font-medium text-foreground mb-3">Preview:</p>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  size="sm"
                  style={{ backgroundColor: normalizeColor(primaryColor) || colors.primary }}
                >
                  Botão Primário
                </Button>
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: normalizeColor(secondaryColor) || colors.secondary }}
                >
                  Badge Secundário
                </span>
                <a 
                  href="#" 
                  className="text-sm font-medium"
                  style={{ color: normalizeColor(primaryColor) || colors.primary }}
                  onClick={(e) => e.preventDefault()}
                >
                  Link de exemplo
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1"
                style={{ backgroundColor: normalizeColor(primaryColor) || colors.primary }}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvo!
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar Padrão
              </Button>
            </div>
          </div>
        </section>

        {/* Informações */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Dica:</strong> As cores são salvas automaticamente enquanto você digita. 
            O fundo branco é mantido para garantir legibilidade e clareza visual.
          </p>
        </div>
      </main>
    </div>
  )
}
