"""
Aplicação principal do backend usando Agno AgentOS
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from agno.os import AgentOS
import logging

from .config.settings import settings
from .agents.chat_agent import chat_agent
from .ingestion.pipeline import ingestion_pipeline

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Criar aplicação FastAPI
app = FastAPI(
    title="CoCreateAI Backend",
    description="Backend com Agno Framework, Azure OpenAI e Neo4j",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar AgentOS
agent_os = AgentOS(agents=[chat_agent.agent])


# Modelos Pydantic
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None


class IngestionRequest(BaseModel):
    document: Dict[str, Any]
    document_type: str = "Document"


class ConversationIngestionRequest(BaseModel):
    conversation_id: str
    messages: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]] = None


class EntityRequest(BaseModel):
    entity_type: str
    properties: Dict[str, Any]


class RelationshipRequest(BaseModel):
    from_type: str
    from_id: str
    to_type: str
    to_id: str
    relationship_type: str
    properties: Optional[Dict[str, Any]] = None


# Rotas
@app.get("/")
async def root():
    """Rota raiz"""
    return {
        "message": "CoCreateAI Backend API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint de chat
    
    Args:
        request: Requisição de chat
        
    Returns:
        Resposta do agente
    """
    try:
        response = await chat_agent.chat(
            message=request.message,
            session_id=request.session_id,
            context=request.context
        )
        
        return ChatResponse(
            response=response,
            session_id=request.session_id
        )
    except Exception as e:
        logger.error(f"Erro no chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ingest/document")
async def ingest_document(request: IngestionRequest):
    """
    Ingere um documento no Neo4j
    
    Args:
        request: Dados do documento
        
    Returns:
        Resultado da ingestão
    """
    try:
        result = await ingestion_pipeline.ingest_document(
            document=request.document,
            document_type=request.document_type
        )
        return result
    except Exception as e:
        logger.error(f"Erro na ingestão: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ingest/conversation")
async def ingest_conversation(request: ConversationIngestionRequest):
    """
    Ingere uma conversa no Neo4j
    
    Args:
        request: Dados da conversa
        
    Returns:
        Resultado da ingestão
    """
    try:
        result = await ingestion_pipeline.ingest_conversation(
            conversation_id=request.conversation_id,
            messages=request.messages,
            metadata=request.metadata
        )
        return result
    except Exception as e:
        logger.error(f"Erro na ingestão: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/entity")
async def create_entity(request: EntityRequest):
    """
    Cria uma entidade no Neo4j
    
    Args:
        request: Dados da entidade
        
    Returns:
        Resultado da criação
    """
    try:
        result = await ingestion_pipeline.create_entity(
            entity_type=request.entity_type,
            properties=request.properties
        )
        return result
    except Exception as e:
        logger.error(f"Erro ao criar entidade: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/relationship")
async def create_relationship(request: RelationshipRequest):
    """
    Cria relacionamento entre entidades
    
    Args:
        request: Dados do relacionamento
        
    Returns:
        Resultado da criação
    """
    try:
        result = await ingestion_pipeline.link_entities(
            from_type=request.from_type,
            from_id=request.from_id,
            to_type=request.to_type,
            to_id=request.to_id,
            relationship_type=request.relationship_type,
            properties=request.properties
        )
        return result
    except Exception as e:
        logger.error(f"Erro ao criar relacionamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Integrar AgentOS (opcional - para UI do Agno)
# Descomente as linhas abaixo se quiser usar a UI do AgentOS
# agent_os_app = agent_os.get_app()
# app.mount("/agent-os", agent_os_app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload
    )
