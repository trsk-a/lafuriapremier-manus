import postgres from 'postgres';

let _sql: ReturnType<typeof postgres> | null = null;

/**
 * Get Supabase PostgreSQL connection
 * Uses connection pooler for better performance
 */
export function getSupabaseSql() {
  if (!_sql && process.env.DATABASE_URL) {
    try {
      _sql = postgres(process.env.DATABASE_URL, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
    } catch (error) {
      console.error('[Supabase] Failed to connect:', error);
      _sql = null;
    }
  }
  return _sql;
}

// ── Types ─────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'pending' | 'published';

export interface Noticia {
  id: number;
  autor: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  source: string | null;
  img: string | null;
  url: string;
  published: Date | null;
  status: ContentStatus;
  moderated_by: string | null;
  moderated_at: Date | null;
}

export interface Rumor {
  id: string;
  article_id: string;
  fuente: string;
  titulo: string;
  extracto: string;
  cuerpo: string | null;
  url: string;
  publicado_en: Date;
  temporada: number | null;
  creado_en: Date;
  status: ContentStatus;
  moderated_by: string | null;
  moderated_at: Date | null;
}

export interface Transfer {
  id: string;
  player_id: number;
  player_name: string | null;
  transfer_type: string | null;
  team_in_id: number;
  team_in_name: string | null;
  team_out_id: number;
  team_out_name: string | null;
  transfer_date: Date;
  season: number | null;
  updated_at: Date | null;
}

// ── Noticias ──────────────────────────────────────────────

export async function getNoticias(opts: {
  status?: ContentStatus;
  limit?: number;
  offset?: number;
}) {
  const sql = getSupabaseSql();
  if (!sql) return [];

  try {
    const conditions = [];
    if (opts.status) {
      conditions.push(`status = '${opts.status}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = opts.limit ? `LIMIT ${opts.limit}` : '';
    const offsetClause = opts.offset ? `OFFSET ${opts.offset}` : '';

    const query = `
      SELECT * FROM noticias 
      ${whereClause}
      ORDER BY published DESC
      ${limitClause} ${offsetClause}
    `;

    const result = await sql.unsafe<Noticia[]>(query);
    return result;
  } catch (error) {
    console.error('[Supabase] Error fetching noticias:', error);
    return [];
  }
}

export async function getNoticiaById(id: number) {
  const sql = getSupabaseSql();
  if (!sql) return null;

  try {
    const result = await sql<Noticia[]>`
      SELECT * FROM noticias WHERE id = ${id} LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    console.error('[Supabase] Error fetching noticia:', error);
    return null;
  }
}

export async function updateNoticiaStatus(
  id: number,
  status: ContentStatus,
  moderatedBy?: string
) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    await sql`
      UPDATE noticias 
      SET 
        status = ${status},
        moderated_by = ${moderatedBy || null},
        moderated_at = ${status === 'published' ? new Date() : null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('[Supabase] Error updating noticia status:', error);
    throw error;
  }
}

export async function updateNoticia(
  id: number,
  data: Partial<Pick<Noticia, 'title' | 'summary' | 'content' | 'autor' | 'img'>>
) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');

    if (updates) {
      await sql.unsafe(`UPDATE noticias SET ${updates} WHERE id = ${id}`);
    }
  } catch (error) {
    console.error('[Supabase] Error updating noticia:', error);
    throw error;
  }
}

export async function deleteNoticia(id: number) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    await sql`DELETE FROM noticias WHERE id = ${id}`;
  } catch (error) {
    console.error('[Supabase] Error deleting noticia:', error);
    throw error;
  }
}

// ── Rumores ───────────────────────────────────────────────

export async function getRumores(opts: {
  status?: ContentStatus;
  limit?: number;
  offset?: number;
}) {
  const sql = getSupabaseSql();
  if (!sql) return [];

  try {
    const conditions = [];
    if (opts.status) {
      conditions.push(`status = '${opts.status}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = opts.limit ? `LIMIT ${opts.limit}` : '';
    const offsetClause = opts.offset ? `OFFSET ${opts.offset}` : '';

    const query = `
      SELECT * FROM rumores 
      ${whereClause}
      ORDER BY publicado_en DESC
      ${limitClause} ${offsetClause}
    `;

    const result = await sql.unsafe<Rumor[]>(query);
    return result;
  } catch (error) {
    console.error('[Supabase] Error fetching rumores:', error);
    return [];
  }
}

export async function getRumorById(id: string) {
  const sql = getSupabaseSql();
  if (!sql) return null;

  try {
    const result = await sql<Rumor[]>`
      SELECT * FROM rumores WHERE id = ${id} LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    console.error('[Supabase] Error fetching rumor:', error);
    return null;
  }
}

export async function updateRumorStatus(
  id: string,
  status: ContentStatus,
  moderatedBy?: string
) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    await sql`
      UPDATE rumores 
      SET 
        status = ${status},
        moderated_by = ${moderatedBy || null},
        moderated_at = ${status === 'published' ? new Date() : null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('[Supabase] Error updating rumor status:', error);
    throw error;
  }
}

export async function updateRumor(
  id: string,
  data: Partial<Pick<Rumor, 'titulo' | 'extracto' | 'cuerpo' | 'fuente'>>
) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');

    if (updates) {
      await sql.unsafe(`UPDATE rumores SET ${updates} WHERE id = '${id}'`);
    }
  } catch (error) {
    console.error('[Supabase] Error updating rumor:', error);
    throw error;
  }
}

export async function deleteRumor(id: string) {
  const sql = getSupabaseSql();
  if (!sql) throw new Error('Database not available');

  try {
    await sql`DELETE FROM rumores WHERE id = ${id}`;
  } catch (error) {
    console.error('[Supabase] Error deleting rumor:', error);
    throw error;
  }
}

// ── Transfers ─────────────────────────────────────────────

export async function getTransfers(opts: {
  limit?: number;
  offset?: number;
  season?: number;
}) {
  const sql = getSupabaseSql();
  if (!sql) return [];

  try {
    const conditions = [];
    if (opts.season) {
      conditions.push(`season = ${opts.season}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = opts.limit ? `LIMIT ${opts.limit}` : '';
    const offsetClause = opts.offset ? `OFFSET ${opts.offset}` : '';

    const query = `
      SELECT * FROM transfers 
      ${whereClause}
      ORDER BY transfer_date DESC
      ${limitClause} ${offsetClause}
    `;

    const result = await sql.unsafe<Transfer[]>(query);
    return result;
  } catch (error) {
    console.error('[Supabase] Error fetching transfers:', error);
    return [];
  }
}

// ── Stats ─────────────────────────────────────────────────

export async function getContentStats() {
  const sql = getSupabaseSql();
  if (!sql) return null;

  try {
    const [noticiasStats] = await sql<Array<{
      total: number;
      pending: number;
      published: number;
      draft: number;
    }>>`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'pending')::int as pending,
        COUNT(*) FILTER (WHERE status = 'published')::int as published,
        COUNT(*) FILTER (WHERE status = 'draft')::int as draft
      FROM noticias
    `;

    const [rumoresStats] = await sql<Array<{
      total: number;
      pending: number;
      published: number;
      draft: number;
    }>>`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'pending')::int as pending,
        COUNT(*) FILTER (WHERE status = 'published')::int as published,
        COUNT(*) FILTER (WHERE status = 'draft')::int as draft
      FROM rumores
    `;

    const [transfersCount] = await sql<Array<{ count: number }>>`
      SELECT COUNT(*)::int as count FROM transfers
    `;

    return {
      noticias: noticiasStats,
      rumores: rumoresStats,
      transfers: transfersCount.count,
    };
  } catch (error) {
    console.error('[Supabase] Error fetching stats:', error);
    return null;
  }
}
