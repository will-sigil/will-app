export type StandingsCollection = {
    conferences: Conference[],
    league: {
        id: string;
        name: string;
        alias: string;
    },
    season: {
        id: string;
        year: number;
        type: string;
    },
}

type Conference = {
    id: string;
    name: string;
    alias: string;
    divisions: Division[];
}

export type Division = {
    id: string;
    name: string;
    alias: string;
    teams: Team[];
}

export type Team = {
    id: string;
    name: string;
    market: string;
    sr_id: string;
    reference: string;
    rank: {
        division: number;
        conference: number;
        clinched: string;
    }
}