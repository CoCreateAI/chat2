"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Bot,
  User,
  FileText,
  Calculator,
  BarChart3,
  Flag,
  RefreshCw,
  Paperclip,
} from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { MarkdownRenderer } from "./markdown-renderer"

interface ChatbotPanelProps {
  isExpanded: boolean
  onToggle: () => void
}

const MIN_WIDTH = 320 // Largura mínima: ~20rem
const MAX_WIDTH = 800 // Largura máxima: ~50rem
const DEFAULT_WIDTH = 448 // Largura padrão: 28rem

export default function ChatbotPanel({ isExpanded, onToggle }: ChatbotPanelProps) {
  const { messages, isLoading, sendMessage, resetMessages } = useChat({
    initialMessages: [
      {
        id: "1",
        type: "bot",
        content: "Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?",
        timestamp: new Date(),
      },
    ],
  })
  const [inputValue, setInputValue] = useState("")
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const resizeStartXRef = useRef<number>(0)
  const resizeStartWidthRef = useRef<number>(DEFAULT_WIDTH)

  const quickSuggestions = [
    { icon: Flag, text: "Como posso começar?", category: "Introdução" },
    { icon: FileText, text: "Informações sobre o serviço", category: "Documentos" },
    { icon: Calculator, text: "Fazer um cálculo", category: "Cálculos" },
    { icon: BarChart3, text: "Ver estatísticas", category: "Dados" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Gerenciar redimensionamento do painel
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      // Calcular nova largura baseada no movimento do mouse
      const deltaX = resizeStartXRef.current - e.clientX
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, resizeStartWidthRef.current + deltaX))
      setPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    resizeStartXRef.current = e.clientX
    resizeStartWidthRef.current = panelWidth
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    
    await sendMessage(content)
    setInputValue("")
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div
      className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-card border-l border-border transition-all duration-300 ${
        isExpanded ? "mr-4" : "w-12 mr-2"
      } z-40 shadow-lg`}
      style={isExpanded ? { width: `${panelWidth}px` } : undefined}
    >
      {/* Barra de redimensionamento */}
      {isExpanded && (
        <div
          className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors group"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/30 group-hover:bg-primary/70 rounded-r transition-colors" />
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={onToggle} className="absolute top-4 left-2 z-50 h-8 w-8 p-0">
        {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 ml-8">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm">Assistente Virtual</h3>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip content="Nova conversa">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => resetMessages()}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-7">
              <p className="text-xs text-muted-foreground mt-1">Seu assistente inteligente sempre disponível</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-0" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : ""}`}>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.type === "bot" ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">Fontes consultadas:</p>
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {messages.length <= 1 && (
            <div className="p-4 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">Sugestões rápidas:</p>
              <div className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto p-2"
                    onClick={() => handleQuickSuggestion(suggestion.text)}
                  >
                    {suggestion.icon && <suggestion.icon className="h-3 w-3 mr-2" />}
                    <div className="text-left">
                      <div>{suggestion.text}</div>
                      <div className="text-muted-foreground">{suggestion.category}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border mt-auto sticky bottom-0 bg-card">
            <div className="flex gap-2">
              <Tooltip content="Anexar arquivo (em breve)">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Tooltip>
              <textarea
                ref={textareaRef}
                placeholder="Sua pergunta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }
                }}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isLoading}
                rows={1}
                style={{
                  minHeight: '36px',
                  maxHeight: '150px',
                  height: 'auto',
                  overflowY: 'hidden',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(150, Math.max(36, target.scrollHeight));
                  target.style.height = `${newHeight}px`;

                  if (target.scrollHeight > 150) {
                    target.style.overflowY = 'auto';
                  } else {
                    target.style.overflowY = 'hidden';
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-3 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="flex flex-col items-center justify-center h-full">
          <MessageCircle className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
