/**
 * EXEMPLO DE INTEGRAÇÃO COM NEO4J
 * 
 * Este arquivo mostra como integrar o chat com Neo4j para buscar
 * entidades reais (projetos, processos, pessoas, agentes)
 */

import { Projeto, Processo, Pessoa, Agente } from '@/types';

// Configuração do Neo4j
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// Interface para resultado de busca
interface SearchEntitiesResult {
  projetos: Projeto[];
  processos: Processo[];
  pessoas: Pessoa[];
  agentes: Agente[];
}

/**
 * Busca todas as entidades de uma vez
 * Use este método para o popup de menções
 */
export async function searchEntities(query: string): Promise<SearchEntitiesResult> {
  try {
    const response = await fetch('/api/neo4j/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar entidades: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar entidades:', error);
    return {
      projetos: [],
      processos: [],
      pessoas: [],
      agentes: [],
    };
  }
}

/**
 * Busca apenas projetos
 */
export async function searchProjetos(query: string): Promise<Projeto[]> {
  try {
    const response = await fetch('/api/neo4j/projetos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar projetos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return [];
  }
}

/**
 * Busca detalhes de uma entidade específica pelo ID
 */
export async function getEntityDetails(type: string, id: string) {
  try {
    const response = await fetch(`/api/neo4j/entity/${type}/${id}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar detalhes da entidade: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes da entidade:', error);
    return null;
  }
}

/**
 * Envia mensagem com contexto de entidades para o LLM
 */
export async function sendMessageWithContext(
  message: string,
  entityIds: { type: string; id: string }[]
) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        entities: entityIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

// ================== EXEMPLOS DE API ROUTES (Next.js) ==================

/**
 * Exemplo de API Route: /api/neo4j/search/route.ts
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * import neo4j from 'neo4j-driver';
 * 
 * const driver = neo4j.driver(
 *   process.env.NEO4J_URI!,
 *   neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
 * );
 * 
 * export async function POST(request: NextRequest) {
 *   const { query } = await request.json();
 *   const session = driver.session();
 * 
 *   try {
 *     // Buscar projetos
 *     const projetosResult = await session.run(
 *       `MATCH (p:Projeto)
 *        WHERE toLower(p.nome) CONTAINS toLower($query)
 *        RETURN p.id as id, p.nome as nome, p.descricao as descricao, p.status as status
 *        LIMIT 10`,
 *       { query }
 *     );
 * 
 *     // Buscar processos
 *     const processosResult = await session.run(
 *       `MATCH (proc:Processo)
 *        WHERE toLower(proc.nome) CONTAINS toLower($query)
 *        RETURN proc.id as id, proc.nome as nome, proc.tipo as tipo, proc.responsavel as responsavel
 *        LIMIT 10`,
 *       { query }
 *     );
 * 
 *     // Buscar pessoas
 *     const pessoasResult = await session.run(
 *       `MATCH (pe:Pessoa)
 *        WHERE toLower(pe.nome) CONTAINS toLower($query)
 *        RETURN pe.id as id, pe.nome as nome, pe.cargo as cargo, pe.email as email
 *        LIMIT 10`,
 *       { query }
 *     );
 * 
 *     // Buscar agentes
 *     const agentesResult = await session.run(
 *       `MATCH (a:Agente)
 *        WHERE toLower(a.nome) CONTAINS toLower($query)
 *        RETURN a.id as id, a.nome as nome, a.tipo as tipo, a.descricao as descricao, a.modelo as modelo
 *        LIMIT 10`,
 *       { query }
 *     );
 * 
 *     return NextResponse.json({
 *       projetos: projetosResult.records.map(r => r.toObject()),
 *       processos: processosResult.records.map(r => r.toObject()),
 *       pessoas: pessoasResult.records.map(r => r.toObject()),
 *       agentes: agentesResult.records.map(r => r.toObject()),
 *     });
 *   } catch (error) {
 *     console.error('Erro ao buscar entidades:', error);
 *     return NextResponse.json({ error: 'Erro ao buscar entidades' }, { status: 500 });
 *   } finally {
 *     await session.close();
 *   }
 * }
 */

// ================== QUERIES CYPHER DE EXEMPLO ==================

/**
 * Query para buscar projetos relacionados a uma pessoa
 */
export const QUERY_PROJETOS_PESSOA = `
  MATCH (pe:Pessoa {id: $pessoaId})-[:TRABALHA_EM]->(p:Projeto)
  RETURN p.id as id, p.nome as nome, p.descricao as descricao, p.status as status
`;

/**
 * Query para buscar processos de um projeto
 */
export const QUERY_PROCESSOS_PROJETO = `
  MATCH (proj:Projeto {id: $projetoId})-[:TEM_PROCESSO]->(proc:Processo)
  RETURN proc.id as id, proc.nome as nome, proc.tipo as tipo
`;

/**
 * Query para buscar grafo completo de contexto
 */
export const QUERY_CONTEXTO_ENTIDADE = `
  MATCH (e {id: $entityId})
  OPTIONAL MATCH (e)-[r]-(related)
  RETURN e, collect({rel: type(r), node: related}) as context
  LIMIT 50
`;

/**
 * Query para buscar agentes disponíveis
 */
export const QUERY_AGENTES_DISPONIVEIS = `
  MATCH (a:Agente)
  WHERE a.ativo = true
  RETURN a.id as id, a.nome as nome, a.tipo as tipo, a.modelo as modelo, a.descricao as descricao
  ORDER BY a.nome
`;

// ================== EXEMPLO DE USO ==================

/**
 * Como usar no componente entity-mention.tsx:
 * 
 * import { searchEntities } from '@/services/neo4j-example';
 * 
 * const loadEntities = async () => {
 *   setLoading(true);
 *   try {
 *     const result = await searchEntities(search);
 *     setProjetos(result.projetos);
 *     setProcessos(result.processos);
 *     setPessoas(result.pessoas);
 *     setAgentes(result.agentes);
 *   } catch (error) {
 *     console.error('Erro ao carregar entidades:', error);
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 */

/**
 * Como usar no hook use-chat.ts para enviar contexto ao LLM:
 * 
 * const generateBotResponse = async (userMessage: string, mentions?: EntityMention[]) => {
 *   if (mentions && mentions.length > 0) {
 *     // Buscar detalhes completos das entidades mencionadas
 *     const entityDetails = await Promise.all(
 *       mentions.map(m => getEntityDetails(m.type, m.id))
 *     );
 *     
 *     // Enviar para o LLM com contexto
 *     return await sendMessageWithContext(userMessage, entityDetails);
 *   }
 *   
 *   // Processar mensagem normal
 *   return await fetch('/api/chat', {
 *     method: 'POST',
 *     body: JSON.stringify({ message: userMessage })
 *   });
 * };
 */
