"""
Configurações do backend usando Pydantic Settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    # Neo4j
    neo4j_uri: str
    neo4j_username: str
    neo4j_password: str
    neo4j_database: str = "neo4j"
    aura_instanceid: str = ""
    aura_instancename: str = ""
    
    # Azure OpenAI
    azure_openai_endpoint: str
    azure_openai_key: str
    azure_openai_deployment_name: str
    azure_openai_api_version: str = "2024-07-18"
    
    # Azure OpenAI Embeddings
    azure_openai_embeddings_deployment_name: str = "text-embedding-3-small"
    azure_openai_embeddings_endpoint: str
    azure_openai_embeddings_key: str
    azure_openai_embeddings_dimensions: int = 1536
    
    # Default Provider
    default_provider: str = "azure"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Retorna lista de origens CORS"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Instância global de configurações
settings = Settings()
