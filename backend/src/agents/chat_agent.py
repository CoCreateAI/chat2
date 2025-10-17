"""
Agente de chat usando Agno Framework com Azure OpenAI
"""
from agno.agent import Agent
from agno.models.azure import AzureOpenAI
from agno.db.sqlite import SqliteDb
from typing import Optional, List, Dict, Any
from ..config.settings import settings
from ..services.neo4j_service import neo4j_service


class ChatAgent:
    """Agente de chat com integração Neo4j e Azure OpenAI"""
    
    def __init__(self):
        """Inicializa o agente de chat"""
        
        # Configurar modelo Azure OpenAI
        self.model = AzureOpenAI(
            id=settings.azure_openai_deployment_name,
            azure_endpoint=settings.azure_openai_endpoint,
            azure_deployment=settings.azure_openai_deployment_name,
            api_key=settings.azure_openai_key,
            api_version=settings.azure_openai_api_version,
        )
        
        # Configurar banco de dados SQLite
        db = SqliteDb(db_file="chat_history.db")
        
        # Criar agente Agno
        self.agent = Agent(
            name="CoCreateAI Chat Agent",
            model=self.model,
            # Adicionar banco de dados SQLite para histórico
            db=db,
            # Adicionar histórico ao contexto
            add_history_to_context=True,
            # Habilitar markdown
            markdown=True,
            # Instruções do sistema
            instructions=[
                "Você é um assistente inteligente da CoCreateAI.",
                "Você tem acesso a um grafo de conhecimento no Neo4j.",
                "Responda de forma clara, objetiva e útil.",
                "Use o contexto do grafo quando relevante para enriquecer suas respostas.",
            ],
        )
    
    async def chat(
        self,
        message: str,
        session_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Processa uma mensagem do chat
        
        Args:
            message: Mensagem do usuário
            session_id: ID da sessão (opcional)
            context: Contexto adicional (opcional)
            
        Returns:
            Resposta do agente
        """
        # Buscar contexto do Neo4j se necessário
        graph_context = await self._get_graph_context(message)
        
        # Adicionar contexto ao prompt
        full_message = message
        if graph_context:
            full_message = f"Contexto do grafo:\n{graph_context}\n\nMensagem do usuário:\n{message}"
        
        # Processar com o agente
        response = self.agent.run(full_message, session_id=session_id)
        
        return response.content
    
    async def _get_graph_context(self, message: str) -> Optional[str]:
        """
        Busca contexto relevante no grafo Neo4j
        
        Args:
            message: Mensagem do usuário
            
        Returns:
            Contexto do grafo (se encontrado)
        """
        # TODO: Implementar busca semântica no Neo4j
        # Por enquanto, retorna None
        return None
    
    def get_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Recupera histórico de uma sessão
        
        Args:
            session_id: ID da sessão
            limit: Número máximo de mensagens
            
        Returns:
            Lista de mensagens
        """
        # TODO: Implementar recuperação de histórico do SQLite
        return []


# Instância global do agente
chat_agent = ChatAgent()
