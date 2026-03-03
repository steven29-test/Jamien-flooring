import { createTheme } from "@mui/material/styles";

// Premium, trustworthy palette with a warm Google-like amber accent.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0B1F3A" },   // deep navy
    secondary: { main: "#F9AB00" }, // Google-style amber/yellow
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#101828",
      secondary: "#475467",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"].join(","),
    h1: { fontWeight: 900, letterSpacing: -0.5 },
    h2: { fontWeight: 900, letterSpacing: -0.4 },
    h3: { fontWeight: 900, letterSpacing: -0.3 },
    h4: { fontWeight: 900, letterSpacing: -0.2 },
    button: { fontWeight: 800 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 14 },
        containedPrimary: {
          boxShadow: "0 10px 24px rgba(11,31,58,0.18)",
        },
        outlinedPrimary: {
          borderWidth: 2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 24 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
  },
});
