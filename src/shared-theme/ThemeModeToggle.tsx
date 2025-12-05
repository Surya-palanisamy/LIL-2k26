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
import { Brightness4, Brightness7, Circle } from "@mui/icons-material";
import type { PaletteMode } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

export const ThemeModeToggle: React.FC = () => {
  const { mode, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSetTheme = (newMode: PaletteMode) => {
    setTheme(newMode);
    handleClose();
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
        title="Toggle theme"
      >
        {mode === "dark" ? (
          <Brightness7 sx={{ transition: "0.3s" }} />
        ) : (
          <Brightness4 sx={{ transition: "0.3s" }} />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        PaperProps={{
          sx: { borderRadius: 3, mt: 1, minWidth: 160, boxShadow: 4 },
        }}
      >
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleSetTheme("light")}
          sx={{
            "&.Mui-selected": { bgcolor: "action.selected" },
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Light Mode" />
          {mode === "light" && (
            <Circle sx={{ fontSize: 9, ml: 1, color: "primary.main" }} />
          )}
        </MenuItem>

        <MenuItem
          selected={mode === "dark"}
          onClick={() => handleSetTheme("dark")}
          sx={{
            "&.Mui-selected": { bgcolor: "action.selected" },
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon>
            <Brightness4 fontSize="small" />
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
