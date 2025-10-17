# 🎨 Guia de Cores Customizáveis

## 📋 Visão Geral

Sistema de cores personalizáveis que permite que cada usuário defina a identidade visual da aplicação através de 2 cores principais:

- **Cor Primária:** Botões, links, ícones principais, destaques
- **Cor Secundária:** Badges, cards secundários, elementos de suporte

---

## 🔧 Como Usar em Componentes

### 1. **Importar o Hook**

```tsx
import { useTheme } from '@/contexts/theme-context'

function MeuComponente() {
  const { colors } = useTheme()
  
  // colors.primary    → #000000 (ou cor definida)
  // colors.secondary  → #6b7280 (ou cor definida)
}
```

---

### 2. **Aplicar Cores com Inline Styles**

#### Cor de Fundo:
```tsx
<div style={{ backgroundColor: colors.primary }}>
  Conteúdo com fundo primário
</div>
```

#### Cor de Texto:
```tsx
<span style={{ color: colors.primary }}>
  Texto com cor primária
</span>
```

#### Cor de Borda:
```tsx
<div style={{ borderColor: colors.secondary }}>
  Elemento com borda secundária
</div>
```

#### Combinações:
```tsx
<div style={{ 
  backgroundColor: colors.primary,
  color: 'white',
  borderColor: colors.secondary
}}>
  Múltiplas propriedades
</div>
```

---

### 3. **Aplicar Cores com Opacity**

#### Usando Hexadecimal + Opacidade:
```tsx
// 50% de opacidade (80 em hex)
<div style={{ backgroundColor: `${colors.primary}80` }}>
  Fundo semi-transparente
</div>

// 10% de opacidade (15 em hex)
<div style={{ backgroundColor: `${colors.primary}15` }}>
  Fundo muito transparente
</div>
```

**Tabela de Conversão de Opacidade:**
| % | Hex | Exemplo |
|---|---|---|
| 100% | FF | `${colors.primary}FF` |
| 90% | E6 | `${colors.primary}E6` |
| 80% | CC | `${colors.primary}CC` |
| 70% | B3 | `${colors.primary}B3` |
| 60% | 99 | `${colors.primary}99` |
| 50% | 80 | `${colors.primary}80` |
| 40% | 66 | `${colors.primary}66` |
| 30% | 4D | `${colors.primary}4D` |
| 20% | 33 | `${colors.primary}33` |
| 10% | 1A | `${colors.primary}1A` |
| 5% | 0D | `${colors.primary}0D` |

---

### 4. **Variáveis CSS Globais**

As cores também estão disponíveis como variáveis CSS:

```css
:root {
  --color-primary-custom: #000000;
  --color-secondary-custom: #6b7280;
}
```

**Uso em CSS:**
```css
.meu-elemento {
  background-color: var(--color-primary-custom);
  color: white;
}

.meu-badge {
  border: 1px solid var(--color-secondary-custom);
  color: var(--color-secondary-custom);
}
```

**Uso inline:**
```tsx
<div style={{ 
  backgroundColor: 'var(--color-primary-custom, #000000)' 
}}>
  Fallback se a variável não existir
</div>
```

---

## 🎯 Exemplos Práticos

### Botão Primário:
```tsx
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

function MeuBotao() {
  const { colors } = useTheme()
  
  return (
    <Button style={{ backgroundColor: colors.primary }}>
      Clique aqui
    </Button>
  )
}
```

### Badge Secundário:
```tsx
import { useTheme } from '@/contexts/theme-context'
import { Badge } from '@/components/ui/badge'

function MeuBadge() {
  const { colors } = useTheme()
  
  return (
    <Badge 
      variant="outline"
      style={{ 
        borderColor: colors.secondary, 
        color: colors.secondary 
      }}
    >
      Novo
    </Badge>
  )
}
```

### Avatar com Fundo:
```tsx
import { useTheme } from '@/contexts/theme-context'
import { User } from 'lucide-react'

function Avatar() {
  const { colors } = useTheme()
  
  return (
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: `${colors.primary}15` }}
    >
      <User className="h-5 w-5" style={{ color: colors.primary }} />
    </div>
  )
}
```

### Link com Hover:
```tsx
import { useTheme } from '@/contexts/theme-context'
import { useState } from 'react'

function MeuLink() {
  const { colors } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <a 
      href="#"
      style={{ 
        color: colors.primary,
        opacity: isHovered ? 0.8 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Meu Link
    </a>
  )
}
```

### Card com Borda:
```tsx
import { useTheme } from '@/contexts/theme-context'

function MeuCard() {
  const { colors } = useTheme()
  
  return (
    <div 
      className="p-4 rounded-lg"
      style={{ 
        borderLeft: `4px solid ${colors.primary}`,
        backgroundColor: `${colors.secondary}10`
      }}
    >
      <h3>Título do Card</h3>
      <p>Conteúdo do card...</p>
    </div>
  )
}
```

---

## 🎨 Componentes Já Integrados

Os seguintes componentes **JÁ** usam as cores customizáveis:

### Chat (`chatbot-panel-with-history.tsx`):
- ✅ Avatar do bot (fundo + ícone)
- ✅ Mensagens do usuário (fundo)
- ✅ Badges de entidades mencionadas
- ✅ Badges de fontes consultadas
- ✅ Barra de redimensionamento
- ✅ Loading state (avatar pulsante)

### Login (`login/page.tsx`):
- ✅ Ícone principal
- ✅ Botão de login

### User Menu (`user-menu.tsx`):
- ✅ Avatar sem foto
- ✅ Botão de upload de foto

### Settings (`settings/page.tsx`):
- ✅ Ícone do header
- ✅ Preview de botões
- ✅ Preview de badges
- ✅ Botão de salvar

---

## 🔄 Integração em Novos Componentes

### Checklist para Novos Componentes:

1. **Importar o hook:**
```tsx
import { useTheme } from '@/contexts/theme-context'
```

2. **Obter as cores:**
```tsx
const { colors } = useTheme()
```

3. **Aplicar nos elementos visuais:**
   - Botões principais → `colors.primary`
   - Links/Textos destaque → `colors.primary`
   - Ícones principais → `colors.primary`
   - Badges/Cards → `colors.secondary`
   - Bordas decorativas → `colors.secondary`

4. **Usar opacidade quando apropriado:**
   - Fundos suaves → `${colors.primary}15` (10-15%)
   - Hovers → `${colors.primary}80` (50-80%)
   - Overlays → `${colors.primary}CC` (80%)

---

## 📐 Boas Práticas

### ✅ DO (Faça):

```tsx
// ✅ Use inline styles para cores dinâmicas
<div style={{ backgroundColor: colors.primary }}>

// ✅ Forneça fallbacks
<div style={{ 
  backgroundColor: 'var(--color-primary-custom, #000000)' 
}}>

// ✅ Use opacidade para variações
<div style={{ backgroundColor: `${colors.primary}15` }}>

// ✅ Mantenha consistência
// Primária para ações principais
// Secundária para elementos de suporte
```

### ❌ DON'T (Evite):

```tsx
// ❌ Não use cores hardcoded onde deveria ser dinâmico
<button style={{ backgroundColor: '#000000' }}>

// ❌ Não misture abordagens
// Escolha: inline styles OU variáveis CSS, não ambos

// ❌ Não use cores primárias em excesso
// Reserve para elementos importantes

// ❌ Não use cores que não contrastam com branco
// Sempre teste legibilidade
```

---

## 🧪 Testando Cores

### Testar Diferentes Combinações:

```tsx
// Azul
colors.primary = '#3B82F6'
colors.secondary = '#60A5FA'

// Verde
colors.primary = '#10B981'
colors.secondary = '#34D399'

// Roxo
colors.primary = '#8B5CF6'
colors.secondary = '#A78BFA'

// Vermelho
colors.primary = '#EF4444'
colors.secondary = '#F87171'
```

### Verificar Contraste:
1. Usar ferramenta: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Mínimo WCAG AA: 4.5:1 (texto normal)
3. Mínimo WCAG AAA: 7:1 (texto normal)

---

## 🎨 Paletas Sugeridas

### Corporativo:
```
Primária: #1E40AF (azul escuro)
Secundária: #3B82F6 (azul médio)
```

### Moderno:
```
Primária: #8B5CF6 (roxo)
Secundária: #EC4899 (rosa)
```

### Minimalista:
```
Primária: #000000 (preto)
Secundária: #6B7280 (cinza)
```

### Vibrante:
```
Primária: #F59E0B (laranja)
Secundária: #10B981 (verde)
```

---

## 🔧 API do ThemeContext

### Métodos Disponíveis:

```typescript
interface ThemeContextType {
  colors: {
    primary: string      // Cor primária atual
    secondary: string    // Cor secundária atual
  }
  updateColors: (colors: Partial<ThemeColors>) => void
  resetColors: () => void
}
```

### Exemplos de Uso:

```tsx
import { useTheme } from '@/contexts/theme-context'

function Configuracoes() {
  const { colors, updateColors, resetColors } = useTheme()
  
  // Mudar cor primária
  updateColors({ primary: '#3B82F6' })
  
  // Mudar ambas
  updateColors({ 
    primary: '#3B82F6', 
    secondary: '#60A5FA' 
  })
  
  // Restaurar padrão
  resetColors()
}
```

---

## 📊 Resumo

**Cores Disponíveis:**
- `colors.primary` → Ações principais, destaques
- `colors.secondary` → Elementos de suporte

**Como Aplicar:**
- Inline styles: `style={{ backgroundColor: colors.primary }}`
- Variáveis CSS: `var(--color-primary-custom)`
- Com opacidade: `${colors.primary}80`

**Onde Aplicar:**
- Botões, links, ícones → Primária
- Badges, cards, bordas → Secundária
- Fundos suaves → Primária/Secundária com opacidade

---

**🎉 Sistema de cores totalmente expansível e pronto para novos desenvolvimentos!**
