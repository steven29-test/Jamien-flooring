import { createTheme } from "@mui/material/styles";

// Warm, natural palette inspired by Australian timber and landscape
// Professional blue + warm earth tones for flooring/home improvement
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2C5F7D" },    // Deep warm blue (trust + professional)
    secondary: { main: "#C89D5C" },  // Warm honey gold (natural warmth)
    background: {
      default: "#FFFBF5",            // Warm off-white
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2332",            // Very dark warm gray (darker for readability)
      secondary: "#4A5568",          // Darker warm gray (improved contrast)
    },
    success: { main: "#8B7355" },    // Warm brown (wood tone)
    warning: { main: "#D4A574" },    // Warm tan
    error: { main: "#C85A54" },      // Warm red
    info: { main: "#2C5F7D" },       // Deep blue
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"].join(","),
    h1: { fontWeight: 900, letterSpacing: -0.5, color: "#1A2332" },
    h2: { fontWeight: 900, letterSpacing: -0.4, color: "#1A2332" },
    h3: { fontWeight: 900, letterSpacing: -0.3, color: "#1A2332" },
    h4: { fontWeight: 900, letterSpacing: -0.2, color: "#1A2332" },
    h5: { fontWeight: 800, color: "#1A2332" },
    h6: { fontWeight: 800, color: "#1A2332" },
    body1: { color: "#1A2332" },
    body2: { color: "#4A5568" },
    button: { fontWeight: 800 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: "none", 
          borderRadius: 6,
          transition: "all 0.3s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2C5F7D 0%, #244A5F 100%)",
          boxShadow: "0 4px 15px rgba(44, 95, 125, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #244A5F 0%, #1C3A4A 100%)",
            boxShadow: "0 8px 25px rgba(44, 95, 125, 0.4)",
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: "#2C5F7D",
          color: "#2C5F7D",
          "&:hover": {
            backgroundColor: "rgba(44, 95, 125, 0.04)",
            borderColor: "#244A5F",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { 
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
        colorPrimary: {
          backgroundColor: "rgba(44, 95, 125, 0.1)",
          color: "#2C5F7D",
        },
      },
    },
  },
});
