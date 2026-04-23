import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Upload from "./pages/Upload";
import { AnimatePresence, motion } from "framer-motion";
import GuestModal from "./components/GuestModal";

// Wrapper for transition animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const { user, loading, showGuestModal, setShowGuestModal } = useAuth(); // ✅ UPDATED
  const location = useLocation();

  useEffect(() => {
    console.log("[App] Auth State Check:", {
      user,
      loading,
      path: location.pathname,
    });
  }, [user, loading, location]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            {/* Public Route */}
            <Route
              path="/auth"
              element={
                !user ? (
                  <Login />
                ) : user.isNewUser ? (
                  <Navigate to="/onboarding" />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Protected Onboarding */}
            <Route
              path="/onboarding"
              element={
                user && user.isNewUser ? (
                  <Onboarding />
                ) : (
                  <Navigate to={user ? "/" : "/auth"} />
                )
              }
            />

            {/* Main App Routes */}
            <Route
              path="/"
              element={
                user ? (
                  user.isNewUser ? (
                    <Navigate to="/onboarding" />
                  ) : (
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  )
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />

            <Route
              path="/wishlist"
              element={
                user && user.role !== "guest" ? (
                  <PageWrapper>
                    <Wishlist />
                  </PageWrapper>
                ) : (
                  <Navigate to={user ? "/" : "/auth"} />
                )
              }
            />

            <Route
              path="/upload"
              element={
                user && user.role === "author" ? (
                  <PageWrapper>
                    <Upload />
                  </PageWrapper>
                ) : (
                  <Navigate to={user ? "/" : "/auth"} />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* ✅ GLOBAL GUEST MODAL (FIX) */}
      <GuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
