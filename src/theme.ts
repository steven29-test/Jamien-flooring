import { createTheme } from "@mui/material/styles";

// Premium, trustworthy palette with a warm Google-like amber accent.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0B1F3A" },   // deep navy
    secondary: { main: "#F9AB00" }, // Google amber
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0B1220",
      secondary: "#475467",
    },
    divider: "rgba(15, 23, 42, 0.10)",
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"].join(","),
    h1: { fontWeight: 900, letterSpacing: -0.6 },
    h2: { fontWeight: 900, letterSpacing: -0.5 },
    h3: { fontWeight: 900, letterSpacing: -0.4 },
    h4: { fontWeight: 900, letterSpacing: -0.3 },
    button: { fontWeight: 800, letterSpacing: 0.2 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 14 },
        containedPrimary: {
          boxShadow: "0 10px 26px rgba(11,31,58,0.20)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 24, border: "1px solid rgba(15, 23, 42, 0.10)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 700 },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: { color: "#F9AB00" },
        iconHover: { color: "#F9AB00" },
        iconEmpty: { color: "rgba(249,171,0,0.25)" },
      },
    },
  },
});
