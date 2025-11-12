import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  articles, 
  players, 
  newsletterSubscribers,
  InsertArticle,
  InsertPlayer,
  InsertNewsletterSubscriber,
  matchesCache,
  InsertMatchCache
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Articles ──────────────────────────────────────────────

export async function getArticles(opts: {
  category?: string;
  limit?: number;
  offset?: number;
  accessTier?: "FREE" | "PRO" | "PREMIUM";
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(articles.isPublished, true)];
  
  if (opts.category) {
    conditions.push(eq(articles.category, opts.category as any));
  }
  
  if (opts.accessTier) {
    conditions.push(eq(articles.accessTier, opts.accessTier));
  }

  let query = db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt));

  if (opts.limit) {
    query = query.limit(opts.limit) as any;
  }

  if (opts.offset) {
    query = query.offset(opts.offset) as any;
  }

  return await query;
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function createArticle(article: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(articles).values(article);
  return result;
}

export async function incrementArticleViews(articleId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(articles)
    .set({ views: sql`${articles.views} + 1` })
    .where(eq(articles.id, articleId));
}

// ── Players ───────────────────────────────────────────────

export async function getPlayers(opts: {
  limit?: number;
  offset?: number;
  isPremium?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = opts.isPremium !== undefined 
    ? [eq(players.isPremium, opts.isPremium)]
    : [];

  let query = conditions.length > 0
    ? db.select().from(players).where(and(...conditions)).orderBy(desc(players.updatedAt))
    : db.select().from(players).orderBy(desc(players.updatedAt));

  if (opts.limit) {
    query = query.limit(opts.limit) as any;
  }

  if (opts.offset) {
    query = query.offset(opts.offset) as any;
  }

  return await query;
}

export async function getPlayerBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(players)
    .where(eq(players.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function getPlayerByApiId(apiFootballId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(players)
    .where(eq(players.apiFootballId, apiFootballId))
    .limit(1);

  return result[0] || null;
}

export async function upsertPlayer(player: InsertPlayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (player.apiFootballId) {
    // Try to update existing player
    const existing = await getPlayerByApiId(player.apiFootballId);
    if (existing) {
      await db
        .update(players)
        .set({ ...player, updatedAt: new Date() })
        .where(eq(players.apiFootballId, player.apiFootballId));
      return;
    }
  }

  // Insert new player
  await db.insert(players).values(player);
}

// ── Newsletter ────────────────────────────────────────────

export async function subscribeToNewsletter(subscriber: InsertNewsletterSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already subscribed
  const existing = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, subscriber.email))
    .limit(1);

  if (existing.length > 0) {
    // Reactivate if unsubscribed
    await db
      .update(newsletterSubscribers)
      .set({ 
        isActive: true, 
        unsubscribedAt: null,
        frequency: subscriber.frequency || "weekly",
        tier: subscriber.tier || "FREE"
      })
      .where(eq(newsletterSubscribers.email, subscriber.email));
    return;
  }

  // Create new subscription
  await db.insert(newsletterSubscribers).values(subscriber);
}

export async function unsubscribeFromNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(newsletterSubscribers)
    .set({ 
      isActive: false, 
      unsubscribedAt: new Date() 
    })
    .where(eq(newsletterSubscribers.email, email));
}

export async function getActiveNewsletterSubscribers(tier?: "FREE" | "PRO" | "PREMIUM") {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(newsletterSubscribers.isActive, true)];
  
  if (tier) {
    conditions.push(eq(newsletterSubscribers.tier, tier));
  }

  let query = db
    .select()
    .from(newsletterSubscribers)
    .where(and(...conditions));

  return await query;
}

// ── Match Cache ───────────────────────────────────────────

export async function getCachedMatch(apiFootballId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(matchesCache)
    .where(
      and(
        eq(matchesCache.apiFootballId, apiFootballId),
        sql`${matchesCache.expiresAt} > NOW()`
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function upsertMatchCache(matchCache: InsertMatchCache) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(matchesCache)
    .where(eq(matchesCache.apiFootballId, matchCache.apiFootballId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(matchesCache)
      .set({ 
        ...matchCache, 
        lastFetched: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(matchesCache.apiFootballId, matchCache.apiFootballId));
    return;
  }

  await db.insert(matchesCache).values(matchCache);
}

export async function cleanExpiredMatchCache() {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(matchesCache)
    .where(sql`${matchesCache.expiresAt} < NOW()`);
}
