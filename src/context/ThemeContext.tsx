"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import type { PaletteMode } from "@mui/material"
import { colorSchemes, typography, shadows, shape } from "../shared-theme/themePrimitives"
import { inputsCustomizations } from "../shared-theme/customizations/inputs"
import { dataDisplayCustomizations } from "../shared-theme/customizations/dataDisplay"
import { feedbackCustomizations } from "../shared-theme/customizations/feedback"
import { navigationCustomizations } from "../shared-theme/customizations/navigation"
import { surfacesCustomizations } from "../shared-theme/customizations/surfaces"

interface ThemeContextType {
  mode: PaletteMode
  toggleTheme: () => void
  setTheme: (mode: PaletteMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme-mode") as PaletteMode
      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        return savedMode
      }
      // Default to system preference
      return (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light") as PaletteMode
    }
    return "light"
  })

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "data-mui-color-scheme",
          cssVarPrefix: "template",
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
        },
      }),
    [],
  )

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"
      if (typeof window !== "undefined") {
        localStorage.setItem("theme-mode", newMode)
        document.documentElement.setAttribute("data-mui-color-scheme", newMode)
      }
      return newMode
    })
  }

  const setTheme = (newMode: PaletteMode) => {
    setMode(newMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-mode", newMode)
      document.documentElement.setAttribute("data-mui-color-scheme", newMode)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-mui-color-scheme", mode)
    }
  }, [mode])

  const value: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeContextProvider")
  }
  return context
}
