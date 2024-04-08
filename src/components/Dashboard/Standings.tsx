import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { StandingsCollection } from '../../types/db';
import { Container, Typography, Box } from '@mui/material';
import { popDivs, popTeams } from './util';

type StandingsProps = {
    standings: StandingsCollection;
}

export const Standings: React.FC<StandingsProps> = ({ standings }) => {
    const { league, conferences } = standings;
    const divs = popDivs(conferences);
    const teams = popTeams(divs);

    
    const rows: GridRowsProp = teams.map((team) => {
        let playoffIcon
        if(team.rank.clinched === 'playoff_spot') {
            playoffIcon = 'x';
        }
        if(team.rank.clinched === 'eliminated') {
            playoffIcon = 'eliminated';
        }
        if(team.rank.clinched === undefined) {
            playoffIcon = null;
        }
        return {
            id: team.id,
            col1: `${team.market} ${team.name}`,
            col2: team.rank.conference,
            col3: team.rank.division,
            col4: playoffIcon,
        }
    })
    const cols: GridColDef[] = [
        { field: 'col1', headerName: 'Team', width: 300 },
        { field: 'col2', headerName: 'Conference', width: 150 },
        { field: 'col3', headerName: 'Division', width: 150 },
        { field: 'col4', headerName: 'Clinched', width: 150 },
    ]
    return (
        <Box>    
            <Container>
                <Typography sx={{mt: 6}} variant='h4'>{league.alias}</Typography>
                <DataGrid sx={{mt: 4}} hideFooter  rows={rows} columns={cols}></DataGrid>
            </Container>
        </Box>
    )
}