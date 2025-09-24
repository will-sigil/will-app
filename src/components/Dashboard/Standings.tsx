import { StandingsCollection } from "../../types/db";
import { Container, Typography, Box } from "@mui/material";

type StandingsProps = {
  standings: StandingsCollection;
};

export const Standings: React.FC<StandingsProps> = () => {
  return (
    <Box>
      <Container>
        <Typography sx={{ mt: 6 }} variant="h4">
          Howdy
        </Typography>
      </Container>
    </Box>
  );
};
