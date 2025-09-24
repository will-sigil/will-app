import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  unlink,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Logout } from "../Auth/Logout/Logout";

function hasProvider(u: User | null, providerId: string) {
  return !!u?.providerData.some((p) => p.providerId === providerId);
}

export const AccountPage: React.FC = () => {
  const auth = getAuth();

  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [loading, setLoading] = React.useState(true);
  const [linking, setLinking] = React.useState(false);
  const [notice, setNotice] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const [reauthOpen, setReauthOpen] = React.useState(false);
  const [reauthPass, setReauthPass] = React.useState("");

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
    });
  }, [auth]);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    }
  };

  const connectGoogle = async () => {
    setError("");
    setNotice("");
    setLinking(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await linkWithPopup(auth.currentUser!, provider);
      await refreshUser();
      setNotice("Google account connected.");
    } catch (err: FirebaseError | unknown) {
      if ((err as FirebaseError)?.code === "auth/popup-blocked") {
        await linkWithRedirect(auth.currentUser!, provider);
        return;
      }
      if ((err as FirebaseError)?.code === "auth/requires-recent-login") {
        setReauthOpen(true);
      } else if (
        (err as FirebaseError)?.code === "auth/credential-already-in-use"
      ) {
        setError("That Google account is already linked to a different user.");
      } else if ((err as FirebaseError)?.code !== "auth/popup-closed-by-user") {
        setError(
          (err as FirebaseError)?.message || "Failed to connect Google."
        );
      }
    } finally {
      setLinking(false);
    }
  };

  const disconnectGoogle = async () => {
    setError("");
    setNotice("");
    try {
      const hasPassword = hasProvider(user, "password");
      if (!hasPassword) {
        setError("Enable a password first before disconnecting Google.");
        return;
      }
      await unlink(auth.currentUser!, "google.com");
      await refreshUser();
      setNotice("Google disconnected.");
    } catch (err: FirebaseError | unknown) {
      setError(
        (err as FirebaseError)?.message || "Failed to disconnect Google."
      );
    }
  };

  const handleReauth = async () => {
    setError("");
    try {
      const cred = EmailAuthProvider.credential(user?.email || "", reauthPass);
      await reauthenticateWithCredential(auth.currentUser!, cred);
      setReauthOpen(false);
      setReauthPass("");
      await connectGoogle();
    } catch (err: FirebaseError | unknown) {
      setError((err as FirebaseError)?.message || "Re-authentication failed.");
    }
  };

  const resendVerification = async () => {
    setError("");
    setNotice("");
    try {
      if (!user) return;
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email?next=${encodeURIComponent(
          "/account"
        )}`,
        handleCodeInApp: true,
      });
      setNotice(`Verification email sent to ${user.email}.`);
    } catch (err: FirebaseError | unknown) {
      setError(
        (err as FirebaseError)?.message || "Failed to send verification email."
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const googleLinked = hasProvider(user, "google.com");
  const passwordLinked = hasProvider(user, "password");

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Account
      </Typography>

      {notice && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <Card>
          <CardHeader title="Profile" />
          <CardContent>
            <Stack spacing={1}>
              <Typography>
                <strong>Email:</strong> {user?.email || "—"}
              </Typography>
              <Typography>
                <strong>Verified:</strong> {user?.emailVerified ? "Yes" : "No"}{" "}
                {!user?.emailVerified && passwordLinked && (
                  <Button size="small" onClick={resendVerification}>
                    Resend verification
                  </Button>
                )}
              </Typography>
              <Typography>
                <strong>Providers:</strong>{" "}
                <Chip
                  size="small"
                  label={`Password ${passwordLinked ? "✓" : "—"}`}
                  sx={{ mr: 1 }}
                />
                <Chip
                  size="small"
                  label={`Google ${googleLinked ? "✓" : "—"}`}
                />
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card data-tour="account-connected-accounts">
          <CardHeader title="Connected accounts" />
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              {!googleLinked ? (
                <Button
                  variant="contained"
                  onClick={connectGoogle}
                  disabled={linking}
                >
                  {linking ? "Connecting…" : "Connect Google"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={disconnectGoogle}
                >
                  Disconnect Google
                </Button>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Connect Google to sign in with one click. You can keep your
              password as a backup method.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      <Logout />

      <Dialog open={reauthOpen} onClose={() => setReauthOpen(false)}>
        <DialogTitle>Confirm your password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please re-enter your current password to continue.
          </Typography>
          <TextField
            autoFocus
            label="Current password"
            type="password"
            fullWidth
            value={reauthPass}
            onChange={(e) => setReauthPass(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReauthOpen(false)}>Cancel</Button>
          <Button onClick={handleReauth} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
