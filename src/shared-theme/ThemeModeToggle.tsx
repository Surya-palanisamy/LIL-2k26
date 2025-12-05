"use client"

import React from "react"
import { useTheme } from "../context/ThemeContext"
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Brightness4, Brightness7, Circle } from "@mui/icons-material"
import type { PaletteMode } from "@mui/material"


export const ThemeModeToggle: React.FC = () => {
  const { mode, setTheme } = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSetTheme = (newMode: PaletteMode) => {
    setTheme(newMode)
    handleClose()
  }

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
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        title="Toggle theme"
      >
        {mode === "dark" ? (
          <Brightness7 sx={{ transition: "transform 0.3s ease" }} />
        ) : (
          <Brightness4 sx={{ transition: "transform 0.3s ease" }} />
        )}
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
          sx={{
            backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.04)" : "transparent",
            "&:hover": {
              backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light Mode</ListItemText>
          {mode === "light" && (
            <Circle
              sx={{
                fontSize: "8px",
                ml: 1,
                color: "primary.main",
              }}
            />
          )}
        </MenuItem>
        <MenuItem
          selected={mode === "dark"}
          onClick={() => handleSetTheme("dark")}
          sx={{
            backgroundColor: mode === "dark" ? "rgba(0, 0, 0, 0.04)" : "transparent",
            "&:hover": {
              backgroundColor: mode === "dark" ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark Mode</ListItemText>
          {mode === "dark" && (
            <Circle
              sx={{
                fontSize: "8px",
                ml: 1,
                color: "primary.main",
              }}
            />
          )}
        </MenuItem>
      </Menu>
    </>
  )
}
