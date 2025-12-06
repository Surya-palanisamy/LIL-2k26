"use client";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from "@mui/material";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LifeBuoy,
  Map as MapIcon,
  PhoneCall,
  Route as RouteIcon,
} from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const ACTIVE_COLOR = "#6E4CF9";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

function NavIcon({ icon: Icon, active }: { icon: LucideIcon; active: boolean }) {
  const theme = useTheme();
  const color = active
    ? "#ffffff"
    : theme.palette.mode === "dark"
    ? "hsl(220, 10%, 70%)"
    : "hsl(222, 25%, 40%)";

  return <Icon size={18} strokeWidth={active ? 2.4 : 2} color={color} />;
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const theme = useTheme();
  const location = useLocation();
  const [openGeneral, setOpenGeneral] = useState(true);

  const dashboards: NavItem[] = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Flood Map", to: "/map", icon: MapIcon },
    { label: "Alerts", to: "/alerts", icon: Bell },
    { label: "Safe Routes", to: "/safe-routes", icon: RouteIcon },
    { label: "Shelters", to: "/shelters", icon: Building2 },
  ];

  const general: NavItem[] = [
    {
      label: "Emergency Help",
      to: "/emergency-help",
      icon: PhoneCall,
    },
  ];

  const getLabelColor = (active: boolean) =>
    active
      ? "#ffffff"
      : theme.palette.mode === "dark"
      ? "hsl(220, 10%, 78%)"
      : "hsl(222, 28%, 32%)";

  return (
    <Box
      sx={{
        width: 260,
        px: 1.5,
        pt: 2,
        pb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
      className="app-sidebar"
    >
      {/* Top section: Dashboards / Overview */}
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{
              mb: 1,
              color:
                theme.palette.mode === "dark"
                  ? "hsl(220, 10%, 65%)"
                  : "hsl(222, 26%, 45%)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.7,
            }}
          >
            Overview
          </ListSubheader>
        } 
      >
        {dashboards.map((item) => {
          const active = location.pathname === item.to;

          return (
            <ListItemButton
              key={item.to}
              component={RouterLink as any}
              to={item.to}
              onClick={onNavigate}
              disableRipple
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                height: 44,
                px: 1.6,
                alignItems: "center",
                transition: "all 0.18s ease-out",
                backgroundColor: active ? "transparent" : "transparent",
                ...(active && {
                  backgroundImage:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #6E4CF9, #4F46E5)"
                      : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 10px 30px rgba(0,0,0,0.7)"
                      : "0 10px 30px rgba(15,23,42,0.18)",
                }),
                "&:hover": {
                  backgroundColor: active
                    ? "transparent"
                    : theme.palette.action.hover,
                  transform: active ? "translateY(-1px)" : "none",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NavIcon icon={item.icon} active={active} />
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  sx: {
                    color: getLabelColor(active),
                    letterSpacing: 0.1,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* General / Support section */}
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{
              mb: 1,
              mt: 0.5,
              color:
                theme.palette.mode === "dark"
                  ? "hsl(220, 10%, 70%)"
                  : "hsl(220, 18%, 50%)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.7,
            }}
          >
            General
          </ListSubheader>
        }
      >
        <ListItemButton
          sx={{
            justifyContent: "space-between",
            px: 1.6,
            py: 1.1,
            color:
              theme.palette.mode === "dark"
                ? "hsl(220, 10%, 75%)"
                : "hsl(220, 18%, 40%)",
            borderRadius: 2,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
          onClick={() => setOpenGeneral((s) => !s)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(110, 76, 249, 0.18)"
                    : "rgba(99, 102, 241, 0.12)",
              }}
            >
              <LifeBuoy size={16} />
            </Box>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Support
            </Box>
          </Box>

          {openGeneral ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </ListItemButton>

        <Collapse in={openGeneral} timeout="auto" unmountOnExit>
          {general.map((item) => {
            const active = location.pathname === item.to;

            return (
              <ListItemButton
                key={item.to}
                component={RouterLink as any}
                to={item.to}
                onClick={onNavigate}
                disableRipple
                sx={{
                  borderRadius: 2,
                  ml: 1,
                  width: "calc(100% - 8px)",
                  mb: 0.5,
                  height: 40,
                  px: 1.6,
                  transition: "all 0.18s ease-out",
                  ...(active && {
                    backgroundImage:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #6E4CF9, #4F46E5)"
                        : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 24px rgba(0,0,0,0.7)"
                        : "0 8px 24px rgba(15,23,42,0.16)",
                  }),
                  "&:hover": {
                    backgroundColor: active
                      ? "transparent"
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NavIcon icon={item.icon} active={active} />
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    sx: {
                      color: getLabelColor(active),
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </Collapse>
      </List>
    </Box>
  );
}
