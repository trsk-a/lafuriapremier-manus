import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as apiFootball from "./lib/apiFootball";
import * as db from "./db";
import { TRPCError } from '@trpc/server';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ── Matches (API-Football) ────────────────────────────────
  matches: router({
    nextMatch: publicProcedure.query(async () => {
      try {
        const match = await apiFootball.getNextMatch();
        return match;
      } catch (error) {
        console.error("Error fetching next match:", error);
        return null;
      }
    }),

    todaysMatches: publicProcedure.query(async () => {
      try {
        const matches = await apiFootball.getTodaysMatches();
        return matches;
      } catch (error) {
        console.error("Error fetching today's matches:", error);
        return [];
      }
    }),

    getMatch: publicProcedure
      .input(z.object({ matchId: z.string() }))
      .query(async ({ input }) => {
        try {
          const match = await apiFootball.getLive(input.matchId);
          return match;
        } catch (error) {
          console.error(`Error fetching match ${input.matchId}:`, error);
          return null;
        }
      }),

    getMatchComplete: publicProcedure
      .input(z.object({ matchId: z.string() }))
      .query(async ({ input }) => {
        try {
          const data = await apiFootball.getMatchComplete(input.matchId);
          return data;
        } catch (error) {
          console.error(`Error fetching complete match ${input.matchId}:`, error);
          return { match: null, lineups: [], stats: [] };
        }
      }),

    getRounds: publicProcedure.query(async () => {
      try {
        const rounds = await apiFootball.getRounds();
        return rounds;
      } catch (error) {
        console.error("Error fetching rounds:", error);
        return [];
      }
    }),

    getMatchesByRound: publicProcedure
      .input(z.object({ round: z.string() }))
      .query(async ({ input }) => {
        try {
          const matches = await apiFootball.getMatchesByRound(input.round);
          return matches;
        } catch (error) {
          console.error(`Error fetching matches for round ${input.round}:`, error);
          return [];
        }
      }),
  }),

  // ── Articles ──────────────────────────────────────────────
  articles: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        const userTier = ctx.user?.subscriptionTier || "FREE";
        const articles = await db.getArticles({
          category: input.category,
          limit: input.limit,
          offset: input.offset,
        });

        // Filter articles based on user tier
        return articles.filter(article => {
          if (article.accessTier === "FREE") return true;
          if (article.accessTier === "PRO" && (userTier === "PRO" || userTier === "PREMIUM")) return true;
          if (article.accessTier === "PREMIUM" && userTier === "PREMIUM") return true;
          return false;
        });
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input, ctx }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) return null;

        const userTier = ctx.user?.subscriptionTier || "FREE";

        // Check access
        if (article.accessTier === "PRO" && userTier === "FREE") {
          return { ...article, content: null, locked: true };
        }
        if (article.accessTier === "PREMIUM" && userTier !== "PREMIUM") {
          return { ...article, content: null, locked: true };
        }

        // Increment views
        await db.incrementArticleViews(article.id);

        return { ...article, locked: false };
      }),

    create: protectedProcedure
      .input(
        z.object({
          slug: z.string(),
          title: z.string(),
          excerpt: z.string().optional(),
          content: z.string(),
          featuredImage: z.string().optional(),
          category: z.enum(["noticias", "rumores", "fichajes", "analisis", "radar-latino", "talento-iberico", "tactico"]),
          accessTier: z.enum(["FREE", "PRO", "PREMIUM"]).default("FREE"),
          author: z.enum(["ruso", "inge", "mister"]),
          authorName: z.string().optional(),
          tags: z.string().optional(),
          isPublished: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only admins can create articles
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await db.createArticle({
          ...input,
          publishedAt: input.isPublished ? new Date() : null,
        });

        return { success: true };
      }),
  }),

  // ── Players ───────────────────────────────────────────────
  players: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const players = await db.getPlayers({
          limit: input.limit,
          offset: input.offset,
        });
        return players;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input, ctx }) => {
        const player = await db.getPlayerBySlug(input.slug);
        if (!player) return null;

        const userTier = ctx.user?.subscriptionTier || "FREE";

        // Check if premium content is locked
        if (player.isPremium && userTier === "FREE") {
          return { 
            ...player, 
            bio: null, 
            analysis: null, 
            locked: true 
          };
        }

        return { ...player, locked: false };
      }),
  }),

  // ── Newsletter ────────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          frequency: z.enum(["daily", "weekly", "never"]).default("weekly"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const tier = ctx.user?.subscriptionTier || "FREE";
        
        await db.subscribeToNewsletter({
          email: input.email,
          userId: ctx.user?.id,
          tier,
          frequency: input.frequency,
        });

        return { success: true };
      }),

    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.unsubscribeFromNewsletter(input.email);
        return { success: true };
      }),

    subscribers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden ver suscriptores' });
      }
      return await db.getActiveNewsletterSubscribers();
    }),
  }),

  // ── User Subscription ─────────────────────────────────────
  subscription: router({
    upgrade: protectedProcedure
      .input(z.object({ newTier: z.enum(['FREE', 'PRO', 'PREMIUM']) }))
      .mutation(async ({ ctx, input }) => {
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

        const currentTier = ctx.user.subscriptionTier || 'FREE';
        const tierOrder: Record<string, number> = { FREE: 0, PRO: 1, PREMIUM: 2 };

        if (tierOrder[input.newTier] <= tierOrder[currentTier]) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'El nuevo plan debe ser superior al actual' });
        }

        await database.update(users)
          .set({ subscriptionTier: input.newTier, updatedAt: new Date() })
          .where(eq(users.id, ctx.user.id));

        return { success: true, newTier: input.newTier };
      }),
    
    downgrade: protectedProcedure
      .input(z.object({ newTier: z.enum(['FREE', 'PRO', 'PREMIUM']) }))
      .mutation(async ({ ctx, input }) => {
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

        const currentTier = ctx.user.subscriptionTier || 'FREE';
        const tierOrder: Record<string, number> = { FREE: 0, PRO: 1, PREMIUM: 2 };

        if (tierOrder[input.newTier] >= tierOrder[currentTier]) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'El nuevo plan debe ser inferior al actual' });
        }

        await database.update(users)
          .set({ subscriptionTier: input.newTier, updatedAt: new Date() })
          .where(eq(users.id, ctx.user.id));

        return { success: true, newTier: input.newTier };
      }),

    updateTier: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["FREE", "PRO", "PREMIUM"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

        await database.update(users)
          .set({ subscriptionTier: input.tier, updatedAt: new Date() })
          .where(eq(users.id, ctx.user.id));

        return { success: true, tier: input.tier };
      }),
  }),

  // ── Content Moderation (Supabase) ────────────────────────
  moderation: router({
    // Get content stats
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
      }
      
      const supabaseDb = await import('./supabase-db');
      return await supabaseDb.getContentStats();
    }),

    // Noticias
    noticias: router({
      list: protectedProcedure
        .input(z.object({
          status: z.enum(['draft', 'pending', 'published']).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        }))
        .query(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          return await supabaseDb.getNoticias(input);
        }),

      getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          return await supabaseDb.getNoticiaById(input.id);
        }),

      updateStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(['draft', 'pending', 'published']),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.updateNoticiaStatus(input.id, input.status, ctx.user.id.toString());
          return { success: true };
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().optional(),
          summary: z.string().optional(),
          content: z.string().optional(),
          autor: z.string().optional(),
          img: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const { id, ...data } = input;
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.updateNoticia(id, data);
          return { success: true };
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.deleteNoticia(input.id);
          return { success: true };
        }),
    }),

    // Rumores
    rumores: router({
      list: protectedProcedure
        .input(z.object({
          status: z.enum(['draft', 'pending', 'published']).optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        }))
        .query(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          return await supabaseDb.getRumores(input);
        }),

      getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          return await supabaseDb.getRumorById(input.id);
        }),

      updateStatus: protectedProcedure
        .input(z.object({
          id: z.string(),
          status: z.enum(['draft', 'pending', 'published']),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.updateRumorStatus(input.id, input.status, ctx.user.id.toString());
          return { success: true };
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.string(),
          titulo: z.string().optional(),
          extracto: z.string().optional(),
          cuerpo: z.string().optional(),
          fuente: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const { id, ...data } = input;
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.updateRumor(id, data);
          return { success: true };
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          await supabaseDb.deleteRumor(input.id);
          return { success: true };
        }),
    }),

    // Transfers (read-only for now)
    transfers: router({
      list: protectedProcedure
        .input(z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
          season: z.number().optional(),
        }))
        .query(async ({ input, ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores' });
          }
          
          const supabaseDb = await import('./supabase-db');
          return await supabaseDb.getTransfers(input);
        }),
    }),
  }),

  // ── Public Content (Supabase) ─────────────────────────────
  content: router({
    noticias: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const supabaseDb = await import('./supabase-db');
        return await supabaseDb.getNoticias({
          status: 'published',
          ...input,
        });
      }),

    rumores: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const supabaseDb = await import('./supabase-db');
        return await supabaseDb.getRumores({
          status: 'published',
          ...input,
        });
      }),

    transfers: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        season: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const supabaseDb = await import('./supabase-db');
        return await supabaseDb.getTransfers(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
