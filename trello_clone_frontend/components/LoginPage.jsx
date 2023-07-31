import React from "react";
import {
    TextField,
    Container,
    Button,
    Box,
    Typography,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { signIn, signUp } from "../services/UserServices.js"
import { setCookie } from 'cookies-next';

export default function LoginPage({ isSignup }) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [open, setOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    const handleLogin = () => {
        let loginResponse;
        if (isSignup) {
            loginResponse = signUp(firstname, lastname, email)
        } else {
            loginResponse = signIn(email)
        }

        loginResponse
            .then(response => {
                if (!response.ok) {
                    setOpen(true)
                    setErrorMsg("Sign" + (isSignup ? "up" : "in") + " failed")
                    throw new Error('Network response was not OK');
                }

                return response.json();
            })
            .then(user => {
                if (user.error) {
                    setOpen(true)
                    setErrorMsg(user.error)
                } else {
                    setCookie('user', user)
                    router.push('/board/' + user.id)
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            })
    }

    let nameComponents = () => (
        <Grid container>
            <Grid item xs>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstname"
                    label="firstname"
                    name="firstname"
                    autoComplete="firstname"
                    autoFocus
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </Grid>
            <Grid item xs>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastname"
                    label="lastname"
                    name="lastname"
                    autoComplete="lastname"
                    autoFocus
                    onChange={(e) => setLastname(e.target.value)}
                />
            </Grid>
        </Grid>
    )

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{  
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" style={{ color: "black" }}>
                    {isSignup ? "Sign Up" : "Sign In"}
                </Typography>
                <Box>
                    {isSignup && nameComponents()}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        {isSignup ? "Sign Up" : "Sign In"}
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => router.replace(isSignup ? 'signin' : 'signup')}
                        fullWidth
                    >
                        {isSignup ? "Already have an account? Sign In" : "No account? Sign Up"}
                    </Button>
                </Box>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
}