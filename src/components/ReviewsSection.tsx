import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import type { Review } from "../types/catalog";
import { useMemo, useState } from "react";

type Props = {
  reviews: Review[];
};

function initials(name: string) {
  const parts = name.replace(".", "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "J";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function ReviewCard({ r }: { r: Review }) {
  const tone =
    r.type === "premium"
      ? { border: "divider", bg: "rgba(11,31,58,0.02)", chip: "Premium timber" }
      : { border: "divider", bg: "transparent", chip: "Great value" };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: tone.border,
        bgcolor: tone.bg,
        boxShadow: 1,
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1.2} alignItems="flex-start">
          <Avatar sx={{ fontWeight: 900 }}>{initials(r.name)}</Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={0.7} alignItems="center" sx={{ flexWrap: "wrap", gap: 0.7 }}>
              <Rating value={r.rating} readOnly size="small" sx={{ color: "secondary.main" }} />

              <Chip size="small" label={tone.chip} />
              <Chip size="small" variant="outlined" label={r.suburb} />
            </Stack>

            <Typography variant="body1" sx={{ mt: 1, fontWeight: 650, lineHeight: 1.45 }}>
              {r.text}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              — {r.name}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ReviewsSection({ reviews }: Props) {
  const [tab, setTab] = useState<"all" | "premium" | "value">("all");

  const filtered = useMemo(() => {
    if (tab === "all") return reviews;
    return reviews.filter((r) => r.type === tab);
  }, [reviews, tab]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
            What our clients say
          </Typography>
</Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 999,
            px: 1,
            border: "1px solid",
            borderColor: "divider",
            minHeight: 44,
          }}
        >
          <Tab value="all" label="All" sx={{ fontWeight: 900, minHeight: 44 }} />
          <Tab value="premium" label="Premium Timber" sx={{ fontWeight: 900, minHeight: 44 }} />
          <Tab value="value" label="Great Value" sx={{ fontWeight: 900, minHeight: 44 }} />
        </Tabs>
      </Stack>

      <Grid container spacing={2}>
        {filtered.map((r) => (
          <Grid item xs={12} md={6} key={r.id}>
            <ReviewCard r={r} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
