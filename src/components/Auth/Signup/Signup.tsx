import { AuthContext } from "../AuthProvider/AuthProvider";
import {
  Container,
  Alert,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  sendEmailVerification,
  User,
} from "firebase/auth";

import "firebaseui/dist/firebaseui.css";
import { FirebaseError } from "firebase/app";

const NEXT_STEP_ROUTE = "/signup/questions";
const VERIFY_ROUTE = "/verify-email";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const authContext = useContext(AuthContext);
  const auth = getAuth();

  const goNext = (user: User | null) => {
    if (!user) {
      navigate(NEXT_STEP_ROUTE);
      return;
    }
    const isPasswordProvider = user.providerData.some(
      (p) => p.providerId === "password"
    );
    if (isPasswordProvider && !user.emailVerified) {
      navigate(`${VERIFY_ROUTE}?next=${encodeURIComponent(NEXT_STEP_ROUTE)}`);
    } else {
      navigate(NEXT_STEP_ROUTE);
    }
  };

  const signupWithUsernameAndPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setNotice("");
    if (password !== confirmPass) {
      setNotice("Passwords don't match. Please try again.");
      return;
    }
    try {
      setSubmitting(true);
      const cred = await authContext?.createUser(email, password);
      if (cred?.user && !cred.user.emailVerified) {
        try {
          await sendEmailVerification(cred.user);
        } catch (err) {
          console.error("Failed to send verification email:", err);
        }
      }
      goNext(cred?.user ?? null);
    } catch (err: unknown) {
      setNotice(
        (err as Error)?.message ||
          "Sorry, something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setNotice("");
    setSubmitting(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      goNext(result.user);
    } catch (err: FirebaseError | unknown) {
      if ((err as FirebaseError)?.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, provider);
        return;
      }
      if (
        (err as FirebaseError)?.code ===
        "auth/account-exists-with-different-credential"
      ) {
        setNotice(
          "Looks like you already signed up with a password. Please sign in with email/password, then link Google from Settings."
        );
      } else {
        setNotice(
          (err as FirebaseError)?.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Sign Up</Typography>
        {notice ? (
          <Alert severity="warning" sx={{ mt: 2, width: "100%" }}>
            {notice}
          </Alert>
        ) : null}

        <Box
          component="form"
          noValidate
          onSubmit={signupWithUsernameAndPassword}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                placeholder="Confirm Password"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>

          <Button sx={{ mt: 4 }} type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Sign Up"}
          </Button>
        </Box>

        <Divider sx={{ my: 4, width: "100%", maxWidth: 600 }}>
          <Typography variant="body2" color="textSecondary">
            or
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          onClick={handleGoogle}
          disabled={submitting}
          sx={{ mb: 6 }}
        >
          Continue with Google
        </Button>
      </Box>
    </Container>
  );
};
