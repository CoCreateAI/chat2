"""
Pipeline de ingestão de dados para Neo4j
"""
from typing import Dict, Any, List
from ..services.neo4j_service import neo4j_service
from ..config.settings import settings
import logging

logger = logging.getLogger(__name__)


class IngestionPipeline:
    """Pipeline para ingestão de dados no Neo4j"""
    
    def __init__(self):
        self.neo4j = neo4j_service
    
    async def ingest_document(
        self,
        document: Dict[str, Any],
        document_type: str = "Document"
    ) -> Dict[str, Any]:
        """
        Ingere um documento no grafo
        
        Args:
            document: Dados do documento
            document_type: Tipo do documento (label do nó)
            
        Returns:
            Resultado da ingestão
        """
        try:
            # Criar nó do documento
            doc_node = self.neo4j.create_node(
                label=document_type,
                properties=document
            )
            
            logger.info(f"Documento ingerido: {doc_node}")
            return {"success": True, "node": doc_node}
            
        except Exception as e:
            logger.error(f"Erro ao ingerir documento: {e}")
            return {"success": False, "error": str(e)}
    
    async def ingest_conversation(
        self,
        conversation_id: str,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Ingere uma conversa no grafo
        
        Args:
            conversation_id: ID da conversa
            messages: Lista de mensagens
            metadata: Metadados da conversa
            
        Returns:
            Resultado da ingestão
        """
        try:
            # Criar nó da conversa
            conversation_props = {
                "id": conversation_id,
                **(metadata or {})
            }
            conv_node = self.neo4j.create_node(
                label="Conversation",
                properties=conversation_props
            )
            
            # Criar nós de mensagens e relacionamentos
            for idx, message in enumerate(messages):
                msg_props = {
                    "id": f"{conversation_id}_msg_{idx}",
                    "content": message.get("content", ""),
                    "role": message.get("role", "user"),
                    "timestamp": message.get("timestamp", ""),
                    "order": idx
                }
                
                msg_node = self.neo4j.create_node(
                    label="Message",
                    properties=msg_props
                )
                
                # Criar relacionamento
                self.neo4j.create_relationship(
                    from_label="Conversation",
                    from_id=conversation_id,
                    to_label="Message",
                    to_id=msg_props["id"],
                    rel_type="HAS_MESSAGE",
                    properties={"order": idx}
                )
            
            logger.info(f"Conversa ingerida: {conversation_id}")
            return {"success": True, "conversation": conv_node}
            
        except Exception as e:
            logger.error(f"Erro ao ingerir conversa: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_entity(
        self,
        entity_type: str,
        properties: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Cria uma entidade no grafo
        
        Args:
            entity_type: Tipo da entidade (Project, Process, Person, Agent)
            properties: Propriedades da entidade
            
        Returns:
            Resultado da criação
        """
        try:
            entity_node = self.neo4j.create_node(
                label=entity_type,
                properties=properties
            )
            
            logger.info(f"Entidade criada: {entity_type} - {properties.get('id')}")
            return {"success": True, "entity": entity_node}
            
        except Exception as e:
            logger.error(f"Erro ao criar entidade: {e}")
            return {"success": False, "error": str(e)}
    
    async def link_entities(
        self,
        from_type: str,
        from_id: str,
        to_type: str,
        to_id: str,
        relationship_type: str,
        properties: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Cria relacionamento entre entidades
        
        Args:
            from_type: Tipo da entidade de origem
            from_id: ID da entidade de origem
            to_type: Tipo da entidade de destino
            to_id: ID da entidade de destino
            relationship_type: Tipo de relacionamento
            properties: Propriedades do relacionamento
            
        Returns:
            Resultado da criação
        """
        try:
            rel = self.neo4j.create_relationship(
                from_label=from_type,
                from_id=from_id,
                to_label=to_type,
                to_id=to_id,
                rel_type=relationship_type,
                properties=properties
            )
            
            logger.info(f"Relacionamento criado: {from_id} -[{relationship_type}]-> {to_id}")
            return {"success": True, "relationship": rel}
            
        except Exception as e:
            logger.error(f"Erro ao criar relacionamento: {e}")
            return {"success": False, "error": str(e)}


# Instância global do pipeline
ingestion_pipeline = IngestionPipeline()
