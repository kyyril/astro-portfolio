import type { ThemeConfig } from "../types";

export const themes: Record<string, ThemeConfig> = {
  adwaita: {
    name: "adwaita",
    displayName: "Adwaita Dark",
    colors: {
      primary: "#3584e4",
      secondary: "#6c71c4",
      accent: "#f5c211",
      background: "#121212", // darker
      surface: "#202020",
      text: "#ffffff", // brighter
      border: "#3a3a3a",
    },
  },
  adwaitaLight: {
    name: "adwaitaLight",
    displayName: "Adwaita Light",
    colors: {
      primary: "#3584e4",
      secondary: "#6c71c4",
      accent: "#f5c211",
      background: "#f5f5f5", // slightly darker
      surface: "#eaeaea",
      text: "#1e1e1e", // darker for contrast
      border: "#c0c0c0",
    },
  },
  dracula: {
    name: "dracula",
    displayName: "Dracula",
    colors: {
      primary: "#bd93f9",
      secondary: "#ff79d1",
      accent: "#50faab",
      background: "#16171f", // darker
      surface: "#222430",
      text: "#ffffff",
      border: "#5a5f89",
    },
  },
  arc: {
    name: "arc",
    displayName: "Arc Dark",
    colors: {
      primary: "#5294e2",
      secondary: "#cccccc",
      accent: "#5294e2",
      background: "#1e222b", // darker
      surface: "#2a2f3a",
      text: "#e4e9ee",
      border: "#3c404b",
    },
  },
  catppuccin: {
    name: "catppuccin",
    displayName: "Catppuccin Mocha",
    colors: {
      primary: "#89b4fa",
      secondary: "#f5c2e7",
      accent: "#f9e2af",
      background: "#13131f", // darker
      surface: "#2a2a3a",
      text: "#e3eafc",
      border: "#3e4052",
    },
  },
  tokyo: {
    name: "tokyo",
    displayName: "Tokyo Night Darker",
    colors: {
      primary: "#7aa2f7",
      secondary: "#bb9af7",
      accent: "#e0af68",
      background: "#0a0a13", // darker
      surface: "#16161e",
      text: "#d0dcff", // brighter
      border: "#2a2e3a",
    },
  },
  unitedUbuntu: {
    name: "unitedUbuntu",
    displayName: "United Ubuntu",
    colors: {
      primary: "#e95420",
      secondary: "#7faf2f",
      accent: "#ffcc00",
      background: "#11000a", // darker
      surface: "#230014",
      text: "#fdf7f6",
      border: "#4c0f0f",
    },
  },
  solarizedDark: {
    name: "solarizedDark",
    displayName: "Solarized Dark",
    colors: {
      primary: "#268bd2",
      secondary: "#2aa198",
      accent: "#b58900",
      background: "#001821", // darker
      surface: "#042b35",
      text: "#9fb3b7", // brighter
      border: "#4d6a72",
    },
  },
};

export const defaultTheme = "tokyo";
