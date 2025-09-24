// src/routes/VerifyEmail.tsx
import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Alert,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  applyActionCode,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

type Status =
  | "idle"
  | "verifying"
  | "success"
  | "already"
  | "need-signin"
  | "waiting"
  | "error";

export const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const mode = params.get("mode");
  const oobCode = params.get("oobCode");
  const continueUrl = params.get("continueUrl");
  const nextParam = params.get("next");
  const next = nextParam || continueUrl || "/";

  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !u.emailVerified) {
        if (!oobCode) setStatus("waiting");
      } else if (u && u.emailVerified) {
        setStatus("already");
      } else if (!u && !oobCode) {
        setStatus("need-signin");
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const verify = async () => {
      if (mode !== "verifyEmail" || !oobCode) return;
      try {
        setStatus("verifying");
        await applyActionCode(auth, oobCode);
        if (auth.currentUser) {
          await auth.currentUser.reload();
          setUser(auth.currentUser);
        }
        setStatus("success");
      } catch (err: FirebaseError | unknown) {
        setErrorMsg(
          (err as FirebaseError)?.message ||
            "The verification link is invalid or has expired. Please request a new one."
        );
        setStatus("error");
      }
    };
    verify();
  }, [auth, mode, oobCode]);

  const checkNow = React.useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        setStatus("success");
        setTimeout(() => navigate(next, { replace: true }), 500);
      }
    } catch (err: FirebaseError | unknown) {
      console.log(err);
    }
  }, [auth, navigate, next]);

  React.useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") checkNow();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [checkNow]);

  const resend = async () => {
    if (!user) {
      setStatus("need-signin");
      return;
    }
    try {
      setStatus("verifying");
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email?next=${encodeURIComponent(
          next
        )}`,
        handleCodeInApp: true,
      });
      setStatus("waiting");
    } catch (err: FirebaseError | unknown) {
      setErrorMsg(
        (err as FirebaseError)?.message ||
          "Failed to send verification email. Try again."
      );
      setStatus("error");
    }
  };

  const goNext = () => {
    navigate(next, { replace: true });
  };

  const goSignin = () => navigate("/signin");

  const renderBody = () => {
    switch (status) {
      case "verifying":
        return (
          <Stack spacing={3} alignItems="center">
            <CircularProgress />
            <Typography>Verifying your email…</Typography>
          </Stack>
        );

      case "success":
        return (
          <Stack spacing={3} alignItems="center">
            <Alert severity="success" sx={{ width: "100%" }}>
              Your email has been verified.
            </Alert>
            <Button variant="contained" onClick={goNext}>
              Continue
            </Button>
          </Stack>
        );

      case "already":
        return (
          <Stack spacing={3} alignItems="center">
            <Alert severity="info" sx={{ width: "100%" }}>
              Your email is already verified.
            </Alert>
            <Button variant="contained" onClick={goNext}>
              Continue
            </Button>
          </Stack>
        );

      case "waiting":
        return (
          <Stack spacing={3} alignItems="center">
            <Typography align="center">
              We sent a verification email
              {user?.email ? ` to ${user.email}` : ""}. Please click the link in
              that email. Didn’t get it?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button onClick={checkNow}>Check again</Button>
              <Button variant="outlined" onClick={resend}>
                Resend verification
              </Button>
            </Stack>
          </Stack>
        );

      case "need-signin":
        return (
          <Stack spacing={3} alignItems="center">
            <Alert severity="warning" sx={{ width: "100%" }}>
              Please sign in to request a new verification email.
            </Alert>
            <Button variant="contained" onClick={goSignin}>
              Go to Sign In
            </Button>
          </Stack>
        );

      case "error":
        return (
          <Stack spacing={3} alignItems="center">
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMsg}
            </Alert>
            <Stack direction="row" spacing={2}>
              {user ? (
                <Button variant="outlined" onClick={resend}>
                  Resend verification
                </Button>
              ) : (
                <Button variant="contained" onClick={goSignin}>
                  Go to Sign In
                </Button>
              )}
              <Button onClick={checkNow}>Check again</Button>
            </Stack>
          </Stack>
        );

      case "idle":
      default:
        return (
          <Stack spacing={3} alignItems="center">
            <CircularProgress />
            <Typography>Preparing verification…</Typography>
          </Stack>
        );
    }
  };

  return (
    <Container maxWidth="sm" sx={{}}>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Verify your email
        </Typography>
        {renderBody()}
      </Box>
    </Container>
  );
};
