"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeColors {
  primary: string    // Cor primária (botões, links, destaques)
  secondary: string  // Cor secundária (badges, cards, elementos menores)
}

interface ThemeContextType {
  colors: ThemeColors
  updateColors: (colors: Partial<ThemeColors>) => void
  resetColors: () => void
}

const DEFAULT_COLORS: ThemeColors = {
  primary: '#1F3B57',    // Azul escuro da identidade visual
  secondary: '#E26A5E',  // Coral/salmão da identidade visual
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS)

  useEffect(() => {
    // Carregar cores do localStorage
    const storedColors = localStorage.getItem('themeColors')
    if (storedColors) {
      setColors(JSON.parse(storedColors))
    }
  }, [])

  useEffect(() => {
    // Aplicar cores no CSS
    document.documentElement.style.setProperty('--color-primary-custom', colors.primary)
    document.documentElement.style.setProperty('--color-secondary-custom', colors.secondary)
  }, [colors])

  const updateColors = (newColors: Partial<ThemeColors>) => {
    const updatedColors = { ...colors, ...newColors }
    setColors(updatedColors)
    localStorage.setItem('themeColors', JSON.stringify(updatedColors))
  }

  const resetColors = () => {
    setColors(DEFAULT_COLORS)
    localStorage.setItem('themeColors', JSON.stringify(DEFAULT_COLORS))
  }

  return (
    <ThemeContext.Provider value={{ colors, updateColors, resetColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
