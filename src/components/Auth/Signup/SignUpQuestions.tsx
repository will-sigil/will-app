import * as React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const DEFAULT_NEXT = "/";

const GOAL_OPTIONS = [
  "Monitor unauthorized sellers",
  "MAP enforcement",
  "Brand protection takedowns",
  "Sales & stock analytics",
  "Other",
];

const MARKETPLACE_OPTIONS = ["Amazon", "Walmart", "eBay", "Other"];

export const SignupQuestions = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const next = params.get("next") || DEFAULT_NEXT;

  const auth = getAuth();
  const db = getFirestore();

  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const [companyName, setCompanyName] = React.useState("");
  const [why, setWhy] = React.useState<string[]>([]);
  const [primaryMarketplace, setPrimaryMarketplace] = React.useState("");

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("Auth state changed, user:", u);
      setUser(u);
      if (!u) {
        setLoading(false);
        navigate(
          "/signin?next=" +
            encodeURIComponent(
              window.location.pathname + window.location.search
            ),
          { replace: true }
        );
        return;
      }

      try {
        const ref = doc(db, "users_onboarding", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            email: u.email ?? null,
            companyName: null,
            role: null,
            why: [],
            primaryMarketplace: null,
            productCount: null,
            status: "started",
            source: "self-serve",
            version: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (e: FirebaseError | unknown) {
        console.log(e);
        setError(
          (e as FirebaseError)?.message || "Failed to load your answers."
        );
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWhy = (value: string) => {
    setWhy((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validate = () => {
    if (!companyName.trim()) return "Please enter your company name.";
    if (!primaryMarketplace.trim())
      return "Please select your primary marketplace.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }

    try {
      setSaving(true);
      const ref = doc(db, "users_onboarding", user.uid);
      console.log(ref);
      await setDoc(
        ref,
        {
          uid: user.uid,
          email: user.email ?? null,
          companyName: companyName.trim(),
          why,
          primaryMarketplace,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate(next);
    } catch (err: FirebaseError | unknown) {
      console.log(err);
      setError(
        (err as FirebaseError)?.message ||
          "Failed to save your answers. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const isPasswordProvider = !!user?.providerData.some(
    (p) => p.providerId === "password"
  );
  const needsVerify = isPasswordProvider && user && !user.emailVerified;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Tell us about your company
        </Typography>

        {needsVerify && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You haven’t verified your email yet. You can continue, but we’ll
            create your tenant and start scans after verification.{" "}
            <Button
              size="small"
              onClick={() =>
                navigate(
                  "/verify-email?next=" +
                    encodeURIComponent(
                      window.location.pathname + window.location.search
                    )
                )
              }
            >
              Verify now
            </Button>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company name"
                fullWidth
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Primary marketplace"
                fullWidth
                value={primaryMarketplace}
                onChange={(e) => setPrimaryMarketplace(e.target.value)}
              >
                {MARKETPLACE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Why are you interested in Sigil? (select all that apply)
              </Typography>
              <FormGroup row>
                {GOAL_OPTIONS.map((g) => (
                  <FormControlLabel
                    key={g}
                    control={
                      <Checkbox
                        checked={why.includes(g)}
                        onChange={() => toggleWhy(g)}
                      />
                    }
                    label={g}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving…" : "Continue"}
            </Button>
            <Button variant="text" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};
