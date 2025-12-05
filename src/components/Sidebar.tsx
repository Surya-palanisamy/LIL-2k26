"use client";

import { NightShelterOutlined as BuildingIcon, Home as HomeIcon, MapOutlined as MapIcon, Route as RouteIcon } from "@mui/icons-material";
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
import {
    Bell as BellIcon,

    ChevronDown,
    ChevronUp,
    Phone as PhoneIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const ACTIVE_COLOR = "#6E4CF9";

function IconWrapper({
  icon,
  color,
}: {
  icon: React.ReactNode;
  color?: string;
}) {
  if (!React.isValidElement(icon)) return icon;

  // Merge existing props and apply style; cast to any so TS is happy with cloneElement
  const mergedProps = {
    ...(icon.props || {}),
    color,
    style: {
      ...{},
      color,
      fill: color,
      stroke: color,
    },
  };

  return React.cloneElement(icon as React.ReactElement, mergedProps as any);
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const theme = useTheme();
  const location = useLocation();
  const [openGeneral, setOpenGeneral] = useState(true);

  const dashboards = [
    { label: "Dashboard", to: "/", icon: <HomeIcon /> },
    { label: "Flood Map", to: "/map", icon: <MapIcon /> },
    { label: "Alerts", to: "/alerts", icon: <BellIcon /> },
    { label: "Safe Routes", to: "/safe-routes", icon: <RouteIcon  /> },
    { label: "Shelters", to: "/shelters", icon: <BuildingIcon  /> },
  ];

  const general = [
    {
      label: "Emergency Help",
      to: "/emergency-help",
      icon: <PhoneIcon size={16} />,
    },
  ];

  const navItemColor = (active: boolean) =>
    active
      ? "#fff"
      : theme.palette.mode === "dark"
      ? "hsl(0,0%,78%)"
      : "hsl(220,20%,28%)";

  return (
    <Box sx={{ width: 256, px: 1, pt: 2 }} className="app-sidebar">
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{
              mb: 1,
              color:
                theme.palette.mode === "dark"
                  ? "hsl(220,15%,70%)"
                  : "hsl(220,20%,50%)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Dashboards
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
                borderRadius: active ? 2 : 1,
                mb: active ? 1 : 0.5,
                height: active ? 44 : 40,
                px: 2,
                bgcolor: active ? ACTIVE_COLOR : "transparent",
                "&:hover": {
                  bgcolor: active ? ACTIVE_COLOR : theme.palette.action.hover,
                },
                boxShadow: active
                  ? theme.palette.mode === "dark"
                    ? "0 6px 18px rgba(0,0,0,0.6)"
                    : "0 6px 18px rgba(16,24,40,0.06)"
                  : "none",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {IconWrapper({ icon: item.icon })}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ height: 10 }} />

      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={{
              mb: 1,
              color:
                theme.palette.mode === "dark"
                  ? "hsl(220,15%,70%)"
                  : "hsl(220,20%,50%)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            General
          </ListSubheader>
        }
      >
        <ListItemButton
          sx={{
            justifyContent: "space-between",
            px: 2,
            py: 1.1,
            color: "text.secondary",
          }}
          onClick={() => setOpenGeneral((s) => !s)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 28, display: "flex", justifyContent: "center" }}>
              {IconWrapper({
                icon: <BuildingIcon />,
              })}
            </Box>
            <Box
              sx={{
                fontWeight: 600,
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
                  borderRadius: active ? 2 : 1,
                  ml: 1,
                  width: "calc(100% - 8px)",
                  mb: active ? 1 : 0.5,
                  height: active ? 44 : 40,
                  px: 2,
                  bgcolor: active ? ACTIVE_COLOR : "transparent",
                  "&:hover": {
                    bgcolor: active ? ACTIVE_COLOR : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {IconWrapper({
                    icon: item.icon,
                  })}
                </ListItemIcon>

                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </Collapse>
      </List>
    </Box>
  );
}
