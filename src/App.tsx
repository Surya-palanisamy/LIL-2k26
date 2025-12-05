"use client";

import { Box, useTheme } from "@mui/material";
import {
  Bell,
  Building2,
  Droplets,
  Home,
  LogOut,
  Map,
  Menu,
  PhoneCall,
  RouteIcon,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Notifications from "./components/Notifications";
import { AppProvider, useAppContext } from "./context/AppContext";
import adminAvatar from "./images/admin.png";
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import EmergencyHelp from "./pages/EmergencyHelp";
import MapView from "./pages/MapView";
import SafeRoutes from "./pages/SafeRoutes";
import Shelters from "./pages/Shelters";
import { ThemeModeToggle } from "./shared-theme/ThemeModeToggle";
import SignInSide from "./sign-in-side/SignInSide";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAppContext();
  const location = useLocation();
  const muiTheme = useTheme();

  useEffect(() => {
    (window as any).__setIsMobileMenuOpen = setIsMobileMenuOpen;

    return () => {
      delete (window as any).__setIsMobileMenuOpen;
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('[data-mobile-menu="true"]');
      const hamburgerButton = document.querySelector('[data-hamburger="true"]');

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        hamburgerButton &&
        !hamburgerButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<SignInSide disableCustomTheme={true} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          zIndex: 50,
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Droplets size={24} color={muiTheme.palette.primary.main} />
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            FloodSense
          </span>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeModeToggle />
          <Notifications />

          <button
            onClick={toggleMobileMenu}
            style={{
              padding: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: muiTheme.palette.text.primary,
            }}
            data-hamburger="true"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </Box>
      </Box>

      <Box
        data-mobile-menu="true"
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          width: 256,
          bgcolor: "background.paper",
          boxShadow: 2,
          transform: {
            xs: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            lg: "translateX(0)",
          },
          transition: "transform 0.3s ease",
          zIndex: 40,
          borderRight: `1px solid ${muiTheme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${muiTheme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Droplets size={24} color={muiTheme.palette.primary.main} />
            <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              FloodSense
            </span>
          </Box>
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Notifications />
          </Box>
          <Box sx={{display: { xs: "none", lg: "block" }}}>
            <ThemeModeToggle />
          </Box>
        </Box>

        <Box component="nav" sx={{ p: 2, mt: 4, lg: { mt: 0 }, space: 1 }}>
          <NavLink
            to="/"
            icon={<Home size={20} />}
            label="Dashboard"
            isActive={location.pathname === "/"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
          <NavLink
            to="/map"
            icon={<Map size={20} />}
            label="Flood Map"
            isActive={location.pathname === "/map"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
          <NavLink
            to="/alerts"
            icon={<Bell size={20} />}
            label="Alerts"
            isActive={location.pathname === "/alerts"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
          <NavLink
            to="/safe-routes"
            icon={<RouteIcon size={20} />}
            label="Safe Routes"
            isActive={location.pathname === "/safe-routes"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
          <NavLink
            to="/shelters"
            icon={<Building2 size={20} />}
            label="Shelters"
            isActive={location.pathname === "/shelters"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
          <NavLink
            to="/emergency-help"
            icon={<PhoneCall size={20} />}
            label="Emergency Help"
            isActive={location.pathname === "/emergency-help"}
            onClick={() => setIsMobileMenuOpen(false)}
            theme={muiTheme}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            p: 2,
            borderTop: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: muiTheme.palette.grey[300],
                  borderRadius: "50%",
                  p: 0.25,
                }}
              >
                <img
                  src={adminAvatar || user?.avatar}
                  alt={user?.name || "User"}
                  style={{
                    width: "40px",
                    height: "30px",
                    borderRadius: "50%",
                  }}
                />
              </Box>
              <Box>
                <div style={{ fontWeight: 500 }}>
                  {user?.name || "Admin User"}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: muiTheme.palette.text.secondary,
                  }}
                >
                  {user?.email || "admin@floodwatch.com"}
                </div>
              </Box>
            </Box>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: muiTheme.palette.text.secondary,
                padding: "0.5rem",
                borderRadius: "0.375rem",
              }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          marginLeft: { xs: 0, lg: "256px" },
          paddingTop: { xs: "64px", lg: 0 },
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safe-routes"
            element={
              <ProtectedRoute>
                <SafeRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelters"
            element={
              <ProtectedRoute>
                <Shelters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency-help"
            element={
              <ProtectedRoute>
                <EmergencyHelp />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<SignInSide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  theme: any;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  icon,
  label,
  isActive,
  onClick,
  theme,
}) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      textDecoration: "none",
      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
      backgroundColor: isActive ? theme.palette.action.selected : "transparent",
      transition: "all 0.2s ease",
      marginBottom: "0.5rem",
    }}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
