"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import type { PaletteMode } from "@mui/material";

export const ThemeModeToggle: React.FC = () => {
  const { mode, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
        title="Toggle theme"
      >
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleSetTheme("light")}
        >
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light Mode</ListItemText>
        </MenuItem>
        <MenuItem
          selected={mode === "dark"}
          onClick={() => handleSetTheme("dark")}
        >
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark Mode</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
