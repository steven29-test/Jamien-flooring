import { alpha, Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import LocationOnIcon from "@mui/icons-material/LocationOn";

type Props = {
  serviceArea: string;
};

function TrustPill({
  icon,
  title,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "blue" | "gold" | "teal";
}) {
  const toneStyles =
    tone === "gold"
      ? {
          tint: "rgba(200, 157, 92, 0.12)",
          border: "rgba(200, 157, 92, 0.28)",
          iconBg: "rgba(200, 157, 92, 0.16)",
          iconColor: "#8B6F47",
        }
      : tone === "teal"
        ? {
            tint: "rgba(100, 180, 160, 0.12)",
            border: "rgba(100, 180, 160, 0.28)",
            iconBg: "rgba(100, 180, 160, 0.16)",
            iconColor: "#4A9B7F",
          }
        : {
            tint: "rgba(44, 95, 125, 0.10)",
            border: "rgba(44, 95, 125, 0.20)",
            iconBg: "rgba(44, 95, 125, 0.14)",
            iconColor: "#2C5F7D",
          };

  return (
    <Stack
      direction="row"
      spacing={1.4}
      alignItems="center"
      sx={{
        p: 1.6,
        borderRadius: 3,
        border: "1.5px solid",
        borderColor: toneStyles.border,
        bgcolor: toneStyles.tint,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.10)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          bgcolor: toneStyles.iconBg,
          color: toneStyles.iconColor,
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.2, color: "#1A2332", fontSize: "0.95rem" }} noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, fontSize: "0.8rem", color: "#4A5568" }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function TrustBar({ serviceArea }: Props) {
  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: 3,
        p: { xs: 2.5, md: 3 },
        border: "1px solid",
        borderColor: "rgba(44, 95, 125, 0.12)",
        background:
          "linear-gradient(135deg, rgba(255, 251, 245, 0.8) 0%, rgba(255, 251, 245, 0.95) 100%)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="blue"
            icon={<WorkspacePremiumIcon sx={{ fontSize: "1.3rem" }} />}
            title="Premium timber finish"
            subtitle="Detail-focused installation"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="gold"
            icon={<PriceCheckIcon sx={{ fontSize: "1.3rem" }} />}
            title="Great value options"
            subtitle="Hybrid & laminate from budget to high-end"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="teal"
            icon={<LocationOnIcon sx={{ fontSize: "1.3rem" }} />}
            title={serviceArea}
            subtitle="Sydney-wide supply & install"
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.2} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}>
        <Chip
          label="Free measure & quote"
          variant="outlined"
          sx={{ 
            borderColor: "rgba(44, 95, 125, 0.25)",
            bgcolor: "rgba(44, 95, 125, 0.06)",
            color: "#2C5F7D",
            fontWeight: 500,
            height: 32,
            fontSize: "0.85rem",
          }}
        />
        <Chip
          label="Clean, tidy finish"
          variant="outlined"
          sx={{ 
            borderColor: "rgba(200, 157, 92, 0.30)",
            bgcolor: "rgba(200, 157, 92, 0.08)",
            color: "#8B6F47",
            fontWeight: 500,
            height: 32,
            fontSize: "0.85rem",
          }}
        />
        <Chip
          label="Straightforward pricing"
          variant="outlined"
          sx={{ 
            borderColor: "rgba(44, 95, 125, 0.20)",
            bgcolor: "rgba(44, 95, 125, 0.04)",
            color: "#2C5F7D",
            fontWeight: 500,
            height: 32,
            fontSize: "0.85rem",
          }}
        />
      </Stack>
    </Box>
  );
}
