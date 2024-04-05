import { Container, Alert, Typography, TextField, Button, Box, Grid } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { useNavigate,} from 'react-router-dom';

type LoginProps = {

}
export const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [notice, setNotice] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const signIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            authContext?.loginUser(email, password)
            .then((res) => {
                console.log(res);
                navigate('/dashboard');
            })
            .catch((err: unknown) => {
                console.log(err)
            })
        } catch (err) {
            console.log(err);
            setNotice('Something went wrong.');
        }
    }

    const signUp = () => {
        navigate('/signup')
    }
    
    useEffect(() => {
        if (authContext && authContext.user) {
            navigate('/dashboard');
        }
    });
    
    return (
        <Container>
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography variant='h3'>Login</Typography>
                {'' !== notice ? (
                    <Alert color='warning'>{notice}</Alert>
                ): null}
                <Box
                    component='form' 
                    noValidate
                    onSubmit={signIn}
                    sx={{ 
                        mt: 3, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Grid container spacing={2} justifyContent="center">
                        <Grid  item xs={8}>
                            <TextField required fullWidth placeholder='Email' type='Email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField required fullWidth placeholder='Password' type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Button sx={{
                        mt: 6
                    }} type='submit' >Login</Button>
                    <Button onClick={signUp}>
                        Sign up
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}