import { StandingsCollection, Division, Team } from "../../types/db";

export const popDivs = (conf: StandingsCollection['conferences']) => {
    return conf.flatMap((item) => {
        return item.divisions
    })
};

export const popTeams = (div: Division[]): Team[] => {
    return div.flatMap((item) => {
        return item.teams
    })
};