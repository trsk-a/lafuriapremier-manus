import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with subscription fields for La Furia Premier.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Subscription fields
  subscriptionTier: mysqlEnum("subscriptionTier", ["FREE", "PRO", "PREMIUM"]).default("FREE").notNull(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "inactive", "cancelled", "expired"]).default("active").notNull(),
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  
  // Newsletter preferences
  newsletterSubscribed: boolean("newsletterSubscribed").default(false).notNull(),
  newsletterFrequency: mysqlEnum("newsletterFrequency", ["daily", "weekly", "never"]).default("weekly").notNull(),
  
  // Favorite teams (comma-separated team IDs)
  favoriteTeams: text("favoriteTeams"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Newsletter subscribers table
 * Tracks email subscriptions even for non-registered users
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  userId: int("userId"), // Optional link to registered user
  tier: mysqlEnum("tier", ["FREE", "PRO", "PREMIUM"]).default("FREE").notNull(),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "never"]).default("weekly").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Articles/News table
 * Stores all content including premium articles
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  
  // Content classification
  category: mysqlEnum("category", [
    "noticias",
    "rumores",
    "fichajes",
    "analisis",
    "radar-latino",
    "talento-iberico",
    "tactico"
  ]).notNull(),
  
  // Access control
  accessTier: mysqlEnum("accessTier", ["FREE", "PRO", "PREMIUM"]).default("FREE").notNull(),
  
  // Author (locutor)
  author: mysqlEnum("author", ["ruso", "inge", "mister"]).notNull(),
  authorName: varchar("authorName", { length: 100 }),
  
  // Metadata
  tags: text("tags"), // JSON array of tags
  relatedTeams: text("relatedTeams"), // JSON array of team IDs
  relatedPlayers: text("relatedPlayers"), // JSON array of player IDs
  
  // Stats
  views: int("views").default(0).notNull(),
  
  // Publishing
  publishedAt: timestamp("publishedAt"),
  isPublished: boolean("isPublished").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Players table
 * Stores player information and stats
 */
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  apiFootballId: int("apiFootballId").unique(), // ID from API-Football
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  position: varchar("position", { length: 50 }),
  nationality: varchar("nationality", { length: 100 }),
  age: int("age"),
  teamId: int("teamId"), // API-Football team ID
  teamName: varchar("teamName", { length: 255 }),
  photo: text("photo"),
  
  // Custom illustration (estilo Greg Capullo)
  customIllustration: text("customIllustration"),
  
  // Stats (updated periodically)
  appearances: int("appearances").default(0),
  goals: int("goals").default(0),
  assists: int("assists").default(0),
  rating: varchar("rating", { length: 10 }),
  
  // Premium content
  isPremium: boolean("isPremium").default(false).notNull(),
  bio: text("bio"),
  analysis: text("analysis"), // Análisis táctico premium
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

/**
 * Matches cache table
 * Stores match data from API-Football to reduce API calls
 */
export const matchesCache = mysqlTable("matchesCache", {
  id: int("id").autoincrement().primaryKey(),
  apiFootballId: int("apiFootballId").notNull().unique(),
  fixtureData: text("fixtureData").notNull(), // JSON string of full match data
  status: varchar("status", { length: 20 }).notNull(),
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  matchDate: timestamp("matchDate").notNull(),
  
  // Cache control
  lastFetched: timestamp("lastFetched").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchCache = typeof matchesCache.$inferSelect;
export type InsertMatchCache = typeof matchesCache.$inferInsert;

/**
 * User favorites table
 * Tracks user's favorite teams and players
 */
export const userFavorites = mysqlTable("userFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entityType: mysqlEnum("entityType", ["team", "player"]).notNull(),
  entityId: int("entityId").notNull(), // Team ID or Player ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

/**
 * Content views tracking
 * For analytics and personalization
 */
export const contentViews = mysqlTable("contentViews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Optional, can track anonymous views
  contentType: mysqlEnum("contentType", ["article", "player", "match"]).notNull(),
  contentId: int("contentId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type ContentView = typeof contentViews.$inferSelect;
export type InsertContentView = typeof contentViews.$inferInsert;
