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

// ── OAuth Users ───────────────────────────────────────────

export interface AppUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
  // Campos adicionales para compatibilidad con User type
  subscriptionTier: 'FREE' | 'PRO' | 'PREMIUM';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  newsletterSubscribed: boolean;
  newsletterFrequency: 'daily' | 'weekly' | 'never';
  favoriteTeams: string | null;
}

export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
  role?: 'admin' | 'user';
}): Promise<void> {
  const sql = getSupabaseSql();
  if (!sql) {
    console.warn('[Supabase] Cannot upsert user: database not available');
    return;
  }

  try {
    const userData = {
      open_id: user.openId,
      name: user.name || null,
      email: user.email || null,
      login_method: user.loginMethod || null,
      last_signed_in: user.lastSignedIn || new Date(),
      role: user.role || 'user',
      updated_at: new Date(),
    };

    // Use PostgreSQL UPSERT (INSERT ... ON CONFLICT)
    await sql`
      INSERT INTO app_users (open_id, name, email, login_method, role, last_signed_in, created_at, updated_at)
      VALUES (
        ${userData.open_id},
        ${userData.name},
        ${userData.email},
        ${userData.login_method},
        ${userData.role},
        ${userData.last_signed_in},
        NOW(),
        NOW()
      )
      ON CONFLICT (open_id) 
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        login_method = EXCLUDED.login_method,
        role = EXCLUDED.role,
        last_signed_in = EXCLUDED.last_signed_in,
        updated_at = NOW()
    `;
  } catch (error) {
    console.error('[Supabase] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<AppUser | undefined> {
  const sql = getSupabaseSql();
  if (!sql) {
    console.warn('[Supabase] Cannot get user: database not available');
    return undefined;
  }

  try {
    const result = await sql<Array<{
      id: number;
      open_id: string;
      name: string | null;
      email: string | null;
      login_method: string | null;
      role: 'admin' | 'user';
      created_at: Date;
      updated_at: Date;
      last_signed_in: Date;
    }>>` 
      SELECT * FROM app_users WHERE open_id = ${openId} LIMIT 1
    `;

    if (result.length === 0) return undefined;

    const user = result[0];
    
    // Force admin role for project owner
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    const isOwner = ownerOpenId && user.open_id === ownerOpenId;
    
    return {
      id: user.id,
      openId: user.open_id,
      name: user.name,
      email: user.email,
      loginMethod: user.login_method,
      role: isOwner ? 'admin' : user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastSignedIn: user.last_signed_in,
      // Valores por defecto para compatibilidad
      subscriptionTier: 'FREE',
      subscriptionStatus: 'active',
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      newsletterSubscribed: false,
      newsletterFrequency: 'never',
      favoriteTeams: null,
    };
  } catch (error) {
    console.error('[Supabase] Failed to get user:', error);
    return undefined;
  }
}

// ── Search Functions ──────────────────────────────────────
export async function searchNoticias(query: string, limit: number = 20) {
  const pool = await getSupabasePool();
  const searchTerm = `%${query}%`;
  
  const result = await pool.query(
    `SELECT * FROM noticias 
     WHERE status = 'published' 
     AND (titular ILIKE $1 OR contenido ILIKE $1)
     ORDER BY fecha DESC
     LIMIT $2`,
    [searchTerm, limit]
  );
  
  return result.rows;
}

export async function searchRumores(query: string, limit: number = 20) {
  const pool = await getSupabasePool();
  const searchTerm = `%${query}%`;
  
  const result = await pool.query(
    `SELECT * FROM rumores 
     WHERE status = 'published' 
     AND (titular ILIKE $1 OR contenido ILIKE $1)
     ORDER BY fecha DESC
     LIMIT $2`,
    [searchTerm, limit]
  );
  
  return result.rows;
}
