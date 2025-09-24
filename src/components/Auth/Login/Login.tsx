// src/Auth/Login/Login.tsx
import {
  Container,
  Alert,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSending, setResetSending] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { search } = useLocation();
  const next = new URLSearchParams(search).get("next") || "/";

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    try {
      setSubmitting(true);
      const res = await authContext?.loginUser(email, password);
      if (res) navigate(next, { replace: true });
    } catch (err: FirebaseError | unknown) {
      console.error(err);
      setNotice((err as FirebaseError)?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    setNotice("");
    setSubmitting(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
      navigate(next, { replace: true });
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
          "This email is registered with a different method. Sign in with your password, then link Google from Account."
        );
      } else if ((err as FirebaseError)?.code !== "auth/popup-closed-by-user") {
        setNotice(
          (err as FirebaseError)?.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openReset = () => {
    setResetEmail(email);
    setResetOpen(true);
  };

  const sendReset = async () => {
    try {
      setResetSending(true);
      setNotice("");
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail, {
        url: `${window.location.origin}/signin}`,
        handleCodeInApp: true,
      });
      setResetOpen(false);
      setNotice(`Password reset link sent to ${resetEmail}. Check your inbox.`);
    } catch (err: FirebaseError | unknown) {
      const code = (err as FirebaseError)?.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setNotice(
          "If an account exists for that address, you'll receive a reset email."
        );
        setResetOpen(false);
      } else {
        setNotice(
          (err as FirebaseError)?.message ||
            "Could not send reset email. Try again."
        );
      }
    } finally {
      setResetSending(false);
    }
  };

  const goToSignup = () => navigate("/signup");

  useEffect(() => {
    if (authContext?.user) navigate(next, { replace: true });
  }, [authContext?.user, next, navigate]);

  return (
    <Container>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h3">Login</Typography>
        {notice ? (
          <Alert severity="warning" sx={{ mt: 2, width: "100%" }}>
            {notice}
          </Alert>
        ) : null}

        <Box
          component="form"
          noValidate
          onSubmit={signIn}
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
                autoComplete="current-password"
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button size="small" onClick={openReset}>
                  Forgot password?
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Button sx={{ mt: 4 }} type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Login"}
          </Button>

          <Button onClick={goToSignup} sx={{ mt: 1 }}>
            Sign up
          </Button>
        </Box>

        <Divider sx={{ my: 4, width: "100%", maxWidth: 600 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          onClick={signInWithGoogle}
          disabled={submitting}
          sx={{ mb: 6 }}
        >
          Continue with Google
        </Button>
      </Box>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset your password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Email address"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            We’ll email you a link to set a new password.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button
            onClick={sendReset}
            variant="contained"
            disabled={!resetEmail || resetSending}
          >
            {resetSending ? "Sending…" : "Send reset link"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
