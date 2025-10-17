"""
Serviço para conexão e operações com Neo4j
"""
from neo4j import GraphDatabase
from typing import List, Dict, Any
from ..config.settings import settings


class Neo4jService:
    """Serviço de conexão com Neo4j"""
    
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password)
        )
    
    def close(self):
        """Fecha a conexão com o banco"""
        self.driver.close()
    
    def execute_query(self, query: str, parameters: Dict[str, Any] = None) -> List[Dict]:
        """
        Executa uma query Cypher no Neo4j
        
        Args:
            query: Query Cypher
            parameters: Parâmetros da query
            
        Returns:
            Lista de resultados
        """
        with self.driver.session(database=settings.neo4j_database) as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]
    
    def create_node(self, label: str, properties: Dict[str, Any]) -> Dict:
        """
        Cria um nó no Neo4j
        
        Args:
            label: Label do nó
            properties: Propriedades do nó
            
        Returns:
            Nó criado
        """
        query = f"""
        CREATE (n:{label} $properties)
        RETURN n
        """
        result = self.execute_query(query, {"properties": properties})
        return result[0] if result else {}
    
    def find_nodes(self, label: str, filters: Dict[str, Any] = None) -> List[Dict]:
        """
        Busca nós no Neo4j
        
        Args:
            label: Label do nó
            filters: Filtros de busca
            
        Returns:
            Lista de nós encontrados
        """
        where_clause = ""
        if filters:
            conditions = [f"n.{key} = ${key}" for key in filters.keys()]
            where_clause = "WHERE " + " AND ".join(conditions)
        
        query = f"""
        MATCH (n:{label})
        {where_clause}
        RETURN n
        """
        return self.execute_query(query, filters or {})
    
    def create_relationship(
        self,
        from_label: str,
        from_id: str,
        to_label: str,
        to_id: str,
        rel_type: str,
        properties: Dict[str, Any] = None
    ) -> Dict:
        """
        Cria um relacionamento entre dois nós
        
        Args:
            from_label: Label do nó de origem
            from_id: ID do nó de origem
            to_label: Label do nó de destino
            to_id: ID do nó de destino
            rel_type: Tipo de relacionamento
            properties: Propriedades do relacionamento
            
        Returns:
            Relacionamento criado
        """
        query = f"""
        MATCH (a:{from_label} {{id: $from_id}})
        MATCH (b:{to_label} {{id: $to_id}})
        CREATE (a)-[r:{rel_type} $properties]->(b)
        RETURN r
        """
        params = {
            "from_id": from_id,
            "to_id": to_id,
            "properties": properties or {}
        }
        result = self.execute_query(query, params)
        return result[0] if result else {}


# Instância global do serviço
neo4j_service = Neo4jService()
