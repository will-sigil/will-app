import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { deepPurple, blue } from '@mui/material/colors';
import { BeachAccess } from "@mui/icons-material";
import { getValue, fetchAndActivate } from "firebase/remote-config";
import { remoteConfig } from "../../../firebase";
import { useEffect, useState } from "react";

export const Header = () => {
    const [bgcolor, setBgColor] = useState<{}>({});
    useEffect(() => {
        const testRemote = async () => {
            await fetchAndActivate(remoteConfig);
            const testVariant = getValue(remoteConfig, 'test');
            const stringValue: string = testVariant.asString();
            console.log(stringValue)
            if(stringValue === 'purple') {
                setBgColor(deepPurple[500]);
            } 
            if(stringValue === 'blue') {
                setBgColor(blue[500])
            }
        }
        testRemote()
    }, [setBgColor]);
    console.log(bgcolor)
    return (
        <AppBar position="static"
            sx={{
                bgcolor: bgcolor
            }}
        >
            <Container>
                <Toolbar
                   
                >
                    <BeachAccess sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography 
                        variant="h6"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                    Will App
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}