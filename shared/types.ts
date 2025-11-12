/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// API Football types (shared between client and server)

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Fixture {
  id: number;
  date: string;
  status: {
    short: string;
    long: string;
    elapsed: number | null;
  };
  venue: {
    name: string | null;
    city: string | null;
  };
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Match {
  fixture: Fixture;
  league: {
    id: number;
    name: string;
    season: number;
    round?: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: {
    halftime: Goals;
    fulltime: Goals;
    extratime: Goals | null;
    penalty: Goals | null;
  };
  events?: MatchEvent[];
}

export interface MatchEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: Team;
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  } | null;
  type: string;
  detail: string;
  comments: string | null;
}

export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface Lineup {
  team: Team;
  formation: string;
  startXI: Array<{ player: LineupPlayer }>;
  substitutes: Array<{ player: LineupPlayer }>;
  coach?: {
    id: number | null;
    name: string | null;
    photo: string | null;
  };
}

export interface Statistic {
  team: Team;
  statistics: Array<{
    type: string;
    value: string | number | null;
  }>;
}
