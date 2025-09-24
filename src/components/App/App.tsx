// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../common/Layout/Layout";
import { Dashboard } from "../Dashboard/Dashboard";
import { CasesPage } from "../Cases/Cases";
import { Login } from "../Auth/Login/Login";
import { Signup } from "../Auth/Signup/Signup";
import { VerifyEmail } from "../Auth/Signup/VerifyEmail";
import { SignupQuestions } from "../Auth/Signup/SignUpQuestions";
import { PrivateRoute } from "../Auth/PrivateRoute/PrivateRoute";
import { AuthProvider } from "../Auth/AuthProvider/AuthProvider";
import { AccountPage } from "../Account/Account";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signup/questions" element={<SignupQuestions />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
