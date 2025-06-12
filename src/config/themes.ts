import type { ThemeConfig } from '../types';

export const themes: Record<string, ThemeConfig> = {
  adwaita: {
    name: 'adwaita',
    displayName: 'Adwaita Dark',
    colors: {
      primary: '#3584e4',
      secondary: '#99c1f1',
      accent: '#f6d32d',
      background: '#242424',
      surface: '#303030',
      text: '#ffffff',
      border: '#404040'
    }
  },
  adwaitaLight: {
    name: 'adwaitaLight',
    displayName: 'Adwaita Light',
    colors: {
      primary: '#3584e4',
      secondary: '#99c1f1',
      accent: '#f6d32d',
      background: '#ffffff',
      surface: '#f6f6f6',
      text: '#000000',
      border: '#e0e0e0'
    }
  },
  arc: {
    name: 'arc',
    displayName: 'Arc Dark',
    colors: {
      primary: '#5294e2',
      secondary: '#7c818c',
      accent: '#5294e2',
      background: '#2f343f',
      surface: '#383c4a',
      text: '#d3dae3',
      border: '#414652'
    }
  },
  arcLight: {
    name: 'arcLight',
    displayName: 'Arc Light',
    colors: {
      primary: '#5294e2',
      secondary: '#7c818c',
      accent: '#5294e2',
      background: '#f8f8f8',
      surface: '#ffffff',
      text: '#4a4a4a',
      border: '#dcdcdc'
    }
  },
  catppuccin: {
    name: 'catppuccin',
    displayName: 'Catppuccin Mocha',
    colors: {
      primary: '#89b4fa',
      secondary: '#cba6f7',
      accent: '#f9e2af',
      background: '#1e1e2e',
      surface: '#313244',
      text: '#cdd6f4',
      border: '#45475a'
    }
  },
  tokyo: {
    name: 'tokyo',
    displayName: 'Tokyo Night',
    colors: {
      primary: '#7aa2f7',
      secondary: '#bb9af7',
      accent: '#e0af68',
      background: '#1a1b26',
      surface: '#1f2335',
      text: '#c0caf5',
      border: '#292e42'
    }
  }
};

export const defaultTheme = 'catppuccin';