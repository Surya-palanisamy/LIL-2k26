// src/shared-theme/ThemeModeToggle.tsx
"use client";

import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  WbSunny,
  DarkMode,
  Circle,
  SettingsBrightness,
} from "@mui/icons-material";
import type { PaletteMode } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

export const ThemeModeToggle: React.FC = () => {
  const { mode, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSetTheme = (newMode: PaletteMode | "system") => {
    setTheme(newMode as PaletteMode);
    handleClose();
  };

  // Auto-pick icon based on current theme
  const renderIcon = () => {
    if (mode === "dark") return <WbSunny sx={{ transition: "0.3s" }} />;
    if (mode === "light") return <DarkMode sx={{ transition: "0.3s" }} />;
    return <SettingsBrightness sx={{ transition: "0.3s" }} />; // system mode icon
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.primary",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.12)",
            bgcolor: "action.hover",
          },
        }}
        title="Theme options"
      >
        {renderIcon()}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        PaperProps={{
          sx: { borderRadius: 3, mt: 1, minWidth: 170, boxShadow: 4 },
        }}
      >
        {/* System Mode */}
        <MenuItem
          selected={mode === "system"}
          onClick={() => handleSetTheme("system")}
        >
          <ListItemIcon>
            <SettingsBrightness fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="System Default" />
          {mode === "system" && (
            <Circle sx={{ fontSize: 9, ml: 1, color: "primary.main" }} />
          )}
        </MenuItem>

        {/* Light Mode */}
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleSetTheme("light")}
        >
          <ListItemIcon>
            <WbSunny fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Light Mode" />
          {mode === "light" && (
            <Circle sx={{ fontSize: 9, ml: 1, color: "primary.main" }} />
          )}
        </MenuItem>

        {/* Dark Mode */}
        <MenuItem
          selected={mode === "dark"}
          onClick={() => handleSetTheme("dark")}
        >
          <ListItemIcon>
            <DarkMode fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
          {mode === "dark" && (
            <Circle sx={{ fontSize: 9, ml: 1, color: "primary.main" }} />
          )}
        </MenuItem>
      </Menu>
    </>
  );
};
