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
  tone: "navy" | "amber" | "emerald";
}) {
  const theme = useTheme();

  const toneStyles =
    tone === "amber"
      ? {
          tint: alpha(theme.palette.secondary.main, 0.14),
          border: alpha(theme.palette.secondary.main, 0.28),
          iconBg: alpha(theme.palette.secondary.main, 0.18),
        }
      : tone === "emerald"
        ? {
            tint: "rgba(16, 185, 129, 0.12)",
            border: "rgba(16, 185, 129, 0.22)",
            iconBg: "rgba(16, 185, 129, 0.16)",
          }
        : {
            tint: alpha(theme.palette.primary.main, 0.08),
            border: alpha(theme.palette.primary.main, 0.18),
            iconBg: alpha(theme.palette.primary.main, 0.12),
          };

  return (
    <Stack
      direction="row"
      spacing={1.4}
      alignItems="center"
      sx={{
        p: 1.6,
        borderRadius: 999,
        border: "1px solid",
        borderColor: toneStyles.border,
        bgcolor: toneStyles.tint,
        boxShadow: "0 10px 30px rgba(11, 31, 58, 0.08)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          bgcolor: toneStyles.iconBg,
          color: "text.primary",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }} noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function TrustBar({ serviceArea }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: 4,
        p: { xs: 1.5, md: 2 },
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.10),
        background:
          `radial-gradient(900px 220px at 15% 0%, ${alpha(theme.palette.secondary.main, 0.18)} 0%, transparent 55%),` +
          `radial-gradient(900px 260px at 85% 10%, ${alpha(theme.palette.primary.main, 0.16)} 0%, transparent 60%),` +
          `linear-gradient(180deg, ${alpha("#ffffff", 0.70)}, ${alpha("#ffffff", 0.90)})`,
      }}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="navy"
            icon={<WorkspacePremiumIcon fontSize="small" />}
            title="Premium timber finish"
            subtitle="Detail-focused installation"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="amber"
            icon={<PriceCheckIcon fontSize="small" />}
            title="Great value options"
            subtitle="Hybrid & laminate from budget to high-end"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrustPill
            tone="emerald"
            icon={<LocationOnIcon fontSize="small" />}
            title={serviceArea}
            subtitle="Sydney-wide supply & install"
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
        <Chip
          label="Free measure & quote"
          variant="outlined"
          sx={{ borderColor: alpha(theme.palette.primary.main, 0.25), bgcolor: alpha(theme.palette.primary.main, 0.06) }}
        />
        <Chip
          label="Clean, tidy finish"
          variant="outlined"
          sx={{ borderColor: alpha(theme.palette.secondary.main, 0.35), bgcolor: alpha(theme.palette.secondary.main, 0.10) }}
        />
        <Chip
          label="Straightforward pricing"
          variant="outlined"
          sx={{ borderColor: alpha(theme.palette.primary.main, 0.20), bgcolor: alpha(theme.palette.primary.main, 0.04) }}
        />
      </Stack>
    </Box>
  );
}
