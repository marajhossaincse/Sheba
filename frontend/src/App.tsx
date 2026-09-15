import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { RootRedirect } from "./pages/RootRedirect";
import { SecretaryDashboard } from "./pages/secretary/SecretaryDashboard";
import { CompanyDnaPage } from "./pages/secretary/CompanyDnaPage";
import { DirectorDashboard } from "./pages/director/DirectorDashboard";
import { ShareholderDashboard } from "./pages/shareholder/ShareholderDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute role="SECRETARY" />}>
            <Route path="/app/secretary" element={<SecretaryDashboard />} />
            <Route path="/app/secretary/company-dna" element={<CompanyDnaPage />} />
          </Route>
          <Route element={<ProtectedRoute role="DIRECTOR" />}>
            <Route path="/app/director" element={<DirectorDashboard />} />
          </Route>
          <Route element={<ProtectedRoute role="SHAREHOLDER" />}>
            <Route path="/app/shareholder" element={<ShareholderDashboard />} />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
