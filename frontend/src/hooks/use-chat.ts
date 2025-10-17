import { useState, useCallback, useEffect } from 'react';
import { Message, EntityMention } from '@/types';
import { sendChatMessage, healthCheck } from '@/services/api';

interface UseChatOptions {
  initialMessages?: Message[];
  onError?: (error: Error) => void;
  onMessageSent?: (message: Message) => void;
  sessionId?: string;
}

export function useChat({ initialMessages = [], onError, onMessageSent, sessionId }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [currentSessionId] = useState(sessionId || `session-${Date.now()}`);

  // Extrair menções de entidades da mensagem
  const extractMentions = (content: string): EntityMention[] => {
    const mentionRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;
    const mentions: EntityMention[] = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const [, name, type, id] = match;
      mentions.push({
        id,
        type: type as any,
        name,
      });
    }
    
    return mentions;
  };

  // Verificar disponibilidade do backend ao montar
  useEffect(() => {
    const checkBackend = async () => {
      const available = await healthCheck();
      setBackendAvailable(available);
      if (!available) {
        console.warn('Backend não disponível. Usando modo offline.');
      }
    };
    checkBackend();
  }, []);

  // Função para gerar resposta usando o backend Agno
  const generateBotResponse = useCallback(async (userMessage: string, mentions?: EntityMention[]): Promise<{ answer: string; sources?: string[] }> => {
    // Se backend não estiver disponível, usar resposta de fallback
    if (!backendAvailable) {
      return {
        answer: '⚠️ Backend não disponível no momento. Por favor, verifique se o servidor está rodando em http://localhost:8000',
        sources: ['Sistema Local']
      };
    }

    try {
      // Preparar contexto com menções
      const context: Record<string, any> = {};
      if (mentions && mentions.length > 0) {
        context.mentions = mentions.map(m => ({
          id: m.id,
          type: m.type,
          name: m.name,
        }));
      }

      // Chamar API do backend
      const response = await sendChatMessage(userMessage, currentSessionId, context);
      
      return {
        answer: response.response,
        sources: ['Azure OpenAI', 'Neo4j Knowledge Graph']
      };
    } catch (error) {
      console.error('Erro ao chamar backend:', error);
      throw error;
    }
  }, [backendAvailable, currentSessionId]);

  // Função para enviar mensagem
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Extrair menções da mensagem
    const mentions = extractMentions(content);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      mentions: mentions.length > 0 ? mentions : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Callback para notificar que a mensagem foi enviada
    if (onMessageSent) {
      onMessageSent(userMessage);
    }
    
    setIsLoading(true);

    try {
      // SUBSTITUA esta chamada pela integração com sua API
      // Passe as menções para sua API poder usar contexto das entidades
      const response = await generateBotResponse(content, mentions);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Callback para notificar que a resposta foi recebida
      if (onMessageSent) {
        onMessageSent(botMessage);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [generateBotResponse, onError, onMessageSent]);

  // Função para limpar mensagens
  const resetMessages = useCallback((welcomeMessage?: string) => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: welcomeMessage || 'Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetMessages,
  };
}
