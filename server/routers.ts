import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as apiFootball from "./lib/apiFootball";
import * as db from "./db";

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
  }),

  // ── User Subscription ─────────────────────────────────────
  subscription: router({
    updateTier: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["FREE", "PRO", "PREMIUM"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // This would integrate with Stripe in production
        // For now, just a placeholder
        return { success: true, tier: input.tier };
      }),
  }),
});

export type AppRouter = typeof appRouter;
