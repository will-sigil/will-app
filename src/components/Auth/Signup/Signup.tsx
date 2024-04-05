import { AuthContext } from '../AuthProvider/AuthProvider';
import { Container, Alert, Typography, TextField, Button, Box, Grid } from '@mui/material';
import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import 'firebaseui/dist/firebaseui.css';

type SignupProps = {

}

export const Signup: React.FC<SignupProps> = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [notice, setNotice] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const authContext = useContext(AuthContext);

    const signupWithUsernameAndPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password === confirmPass) {
            try {
                authContext?.createUser(email, password)
                .then(() => {
                    navigate("/");
                })
                .catch((err: unknown) => {
                    console.log(err)
                })
            } catch {
                setNotice("Sorry, something went wrong. Please try again.");
            }     
        } else {
            setNotice("Passwords don't match. Please try again.");
        }
    };

    return (
        <Container>
            <Box
             sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Typography variant='h3'>Sign Up</Typography>
                {'' !== notice ? (
                    <Alert color='warning'>{notice}</Alert>
                ): null}
                <Box
                    component='form' 
                    noValidate
                    onSubmit={signupWithUsernameAndPassword}
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
                        <Grid item xs={8}>
                            <TextField required fullWidth placeholder='Confrim Password' type='password' value={confirmPass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Button sx={{
                        mt: 6
                    }} type='submit' >Sign Up</Button>
                </Box>
            </Box>
        </Container>
    )
}