"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import ChatbotPanelWithHistory from "@/components/chatbot-panel-with-history"
import { UserMenu } from "@/components/user-menu"

const CHAT_STATE_KEY = 'chat_expanded_state'

export default function Home() {
  const [isChatExpanded, setIsChatExpanded] = useState(false) // Colapsado por padrão
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  
  // Carregar estado do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(CHAT_STATE_KEY)
    if (savedState !== null) {
      setIsChatExpanded(savedState === 'true')
    }
  }, [])
  
  // Proteger rota
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])
  
  // Salvar estado no localStorage
  const handleToggleChat = () => {
    const newState = !isChatExpanded
    setIsChatExpanded(newState)
    localStorage.setItem(CHAT_STATE_KEY, String(newState))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 border-b border-border bg-background h-16 flex items-center justify-between px-6 z-50">
        <h1 className="text-xl font-semibold">CoCreateAI Chat</h1>
        <UserMenu />
      </header>

      {/* Área de conteúdo principal - vazia, apenas para layout */}
      <main className="pt-16">
        {/* Conteúdo principal da aplicação pode ser adicionado aqui */}
      </main>

      {/* Chat Panel with History */}
      <ChatbotPanelWithHistory isExpanded={isChatExpanded} onToggle={handleToggleChat} />
    </div>
  )
}
