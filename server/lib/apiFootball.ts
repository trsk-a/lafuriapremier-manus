import { z } from 'zod';

// ── Esquemas Zod ───────────────────────────────────────────
const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().url(),
});

const FixtureSchema = z.object({
  id: z.number(),
  date: z.string(),
  status: z.object({
    short: z.string(),
    long: z.string(),
    elapsed: z.number().nullable(),
  }),
  venue: z.object({
    name: z.string().nullable(),
    city: z.string().nullable(),
  }),
});

const GoalsSchema = z.object({
  home: z.number().nullable(),
  away: z.number().nullable(),
});

const EventSchema = z.object({
  time: z.object({
    elapsed: z.number(),
    extra: z.number().nullable(),
  }),
  team: TeamSchema,
  player: z.object({
    id: z.number(),
    name: z.string(),
  }),
  assist: z
    .object({
      id: z.number().nullable(),
      name: z.string().nullable(),
    })
    .nullable(),
  type: z.string(),
  detail: z.string(),
  comments: z.string().nullable(),
});

const LineupPlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  number: z.number(),
  pos: z.string(),
  grid: z.string().nullable(),
});

const LineupSchema = z.object({
  team: TeamSchema,
  formation: z.string(),
  startXI: z.array(z.object({ player: LineupPlayerSchema })),
  substitutes: z.array(z.object({ player: LineupPlayerSchema })),
  coach: z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    photo: z.string().nullable(),
  }).optional(),
});

const StatisticSchema = z.object({
  team: TeamSchema,
  statistics: z.array(z.object({
    type: z.string(),
    value: z.union([z.string(), z.number(), z.null()]),
  })),
});

const MatchSchema = z.object({
  fixture: FixtureSchema,
  league: z.object({
    id: z.number(),
    name: z.string(),
    season: z.number(),
    round: z.string().optional(),
  }),
  teams: z.object({ home: TeamSchema, away: TeamSchema }),
  goals: GoalsSchema,
  score: z.object({
    halftime: GoalsSchema,
    fulltime: GoalsSchema,
    extratime: GoalsSchema.nullable(),
    penalty: GoalsSchema.nullable(),
  }),
  events: z.array(EventSchema).optional(),
});

// ── Manejo robusto de `errors` (array u objeto) ────────────
const ErrorsSchema = z
  .union([z.array(z.string()), z.object({}).catchall(z.string())])
  .optional()
  .transform((v) => {
    if (!v) return [];
    return Array.isArray(v) ? v : Object.values(v);
  });

const ApiResponseSchema = z.object({
  response: z.array(MatchSchema),
  errors: ErrorsSchema,
  results: z.number(),
});

const LineupResponseSchema = z.object({
  response: z.array(LineupSchema),
  errors: ErrorsSchema,
  results: z.number(),
});

const StatisticResponseSchema = z.object({
  response: z.array(StatisticSchema),
  errors: ErrorsSchema,
  results: z.number(),
});

// ── Tipos ──────────────────────────────────────────────────
export type Match = z.infer<typeof MatchSchema>;
export type Lineup = z.infer<typeof LineupSchema>;
export type Statistic = z.infer<typeof StatisticSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// ── Configuración API ──────────────────────────────────────
const API_BASE = process.env.API_FOOTBALL_BASE || 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;
const PREMIER_LEAGUE_ID = process.env.PREMIER_LEAGUE_ID || '39';
const SEASON_ACTUAL = process.env.SEASON_ACTUAL || '2024';

function validateApiKey() {
  if (!API_KEY) {
    console.warn('API_FOOTBALL_KEY not configured - API calls will fail');
    throw new Error('API_FOOTBALL_KEY environment variable is required');
  }
}

const getHeaders = () => {
  validateApiKey();
  return {
    'x-apisports-key': API_KEY!,
    'Content-Type': 'application/json',
  };
};

// ── fetch con timeout ──────────────────────────────────────
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {},
  abortSignal?: AbortSignal
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  if (abortSignal) abortSignal.addEventListener('abort', () => controller.abort());

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: { ...getHeaders(), ...fetchOptions.headers },
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// ── Próximo partido ────────────────────────────────────────
export async function getNextMatch(abortSignal?: AbortSignal): Promise<Match | null> {
  try {
    const now = new Date();
    const from = now.toISOString().split('T')[0];
    const toD = new Date(now);
    toD.setDate(toD.getDate() + 14);
    const to = toD.toISOString().split('T')[0];

    const url = `${API_BASE}/fixtures?league=${PREMIER_LEAGUE_ID}&season=${SEASON_ACTUAL}&from=${from}&to=${to}&timezone=UTC`;

    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const validated = ApiResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }

    const matches = validated.response;

    // Primero buscar partidos en vivo
    const live = matches.find(m =>
      ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(m.fixture.status.short)
    );
    if (live) return live;

    // Luego buscar próximos partidos (no terminados)
    const upcoming = matches.find(
      m => m.fixture.status.short === 'NS' && new Date(m.fixture.date) > now
    );
    return upcoming || null;
  } catch (error) {
    console.error('Error fetching next match:', error);
    throw error;
  }
}

// ── Partidos del día ────────────────────────────────────────
export async function getTodaysMatches(abortSignal?: AbortSignal): Promise<Match[]> {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const url = `${API_BASE}/fixtures?league=${PREMIER_LEAGUE_ID}&season=${SEASON_ACTUAL}&from=${today}&to=${tomorrowStr}&timezone=UTC`;

    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const validated = ApiResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }

    const matches = validated.response;
    
    // Filtrar solo partidos de hoy y ordenar por hora
    const todaysMatches = matches
      .filter(m => {
        const matchDate = new Date(m.fixture.date);
        const matchDay = matchDate.toISOString().split('T')[0];
        return matchDay === today;
      })
      .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());

    return todaysMatches;
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
    throw error;
  }
}

// ── Live por id ────────────────────────────────────────────
export async function getLive(matchId: string, abortSignal?: AbortSignal): Promise<Match | null> {
  try {
    const url = `${API_BASE}/fixtures?id=${matchId}&timezone=UTC`;
    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const validated = ApiResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }
    return validated.response[0] || null;
  } catch (error) {
    console.error(`Error fetching live match ${matchId}:`, error);
    throw error;
  }
}

// ── Alineaciones ───────────────────────────────────────────
export async function getLineups(matchId: string, abortSignal?: AbortSignal): Promise<Lineup[]> {
  try {
    const url = `${API_BASE}/fixtures/lineups?fixture=${matchId}`;
    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const validated = LineupResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }
    return validated.response;
  } catch (error) {
    console.error(`Error fetching lineups for match ${matchId}:`, error);
    // Return empty array instead of throwing to avoid breaking the UI
    return [];
  }
}

// ── Estadísticas ───────────────────────────────────────────
export async function getStats(matchId: string, abortSignal?: AbortSignal): Promise<Statistic[]> {
  try {
    const url = `${API_BASE}/fixtures/statistics?fixture=${matchId}`;
    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const validated = StatisticResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }
    return validated.response;
  } catch (error) {
    console.error(`Error fetching stats for match ${matchId}:`, error);
    // Return empty array instead of throwing to avoid breaking the UI
    return [];
  }
}

// ── Match completo (fixture + lineups + stats) ─────────────
export async function getMatchComplete(matchId: string, abortSignal?: AbortSignal) {
  try {
    const [match, lineups, stats] = await Promise.all([
      getLive(matchId, abortSignal),
      getLineups(matchId, abortSignal),
      getStats(matchId, abortSignal),
    ]);

    return {
      match,
      lineups,
      stats,
    };
  } catch (error) {
    console.error(`Error fetching complete match data for ${matchId}:`, error);
    throw error;
  }
}

// ── Jornadas (rounds) ──────────────────────────────────────
export async function getRounds(abortSignal?: AbortSignal): Promise<string[]> {
  try {
    const url = `${API_BASE}/fixtures/rounds?league=${PREMIER_LEAGUE_ID}&season=${SEASON_ACTUAL}`;
    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching rounds:', error);
    throw error;
  }
}

// ── Partidos por jornada ───────────────────────────────────
export async function getMatchesByRound(round: string, abortSignal?: AbortSignal): Promise<Match[]> {
  try {
    const url = `${API_BASE}/fixtures?league=${PREMIER_LEAGUE_ID}&season=${SEASON_ACTUAL}&round=${encodeURIComponent(round)}&timezone=UTC`;
    const res = await fetchWithTimeout(url, { timeout: 10000 }, abortSignal);
    if (!res.ok) {
      if (res.status === 429) throw new Error('Rate limit exceeded');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const validated = ApiResponseSchema.parse(data);
    if (validated.errors.length > 0) {
      throw new Error(`API errors: ${validated.errors.join(', ')}`);
    }
    return validated.response;
  } catch (error) {
    console.error(`Error fetching matches for round ${round}:`, error);
    throw error;
  }
}
