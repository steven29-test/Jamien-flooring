import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Section from "../components/Section";
import type { CatalogData } from "../types/catalog";
import { assetUrl } from "../utils/assetUrl";

type Props = { catalog: CatalogData };

export default function Deals({ catalog }: Props) {
  const deals = (catalog.items ?? []).filter((i) => i.isDeal);

  return (
    <Section
      title="Hot deals"
      subtitle="Limited stock / promotional picks. Replace sample deals with real offers anytime."
    >
      <Grid container spacing={2}>
        {deals.map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i.id}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              {(i.images?.[0] ?? i.imageUrl) ? (
                <CardMedia
                  component="img"
                  height="190"
                  image={(i.images?.[0] ?? i.imageUrl) as string}
                  alt={i.name}
                />
              ) : (
                <Box sx={{ height: 190, bgcolor: "grey.100" }} />
              )}

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {i.name}
                </Typography>
                {i.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {i.subtitle}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                  <Chip size="small" color="success" label="Hot deal" />
                  {i.brand && <Chip size="small" variant="outlined" label={i.brand} />}
                  {i.priceHint && <Chip size="small" label={i.priceHint} />}
                </Stack>

                {(i.specs?.length ?? 0) > 0 && (
                  <Stack spacing={0.4} sx={{ mt: 1 }}>
                    {i.specs!.slice(0, 3).map((s, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">
                        • {s}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {deals.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography color="text.secondary">
            No deals yet. Mark products with <b>isDeal: true</b> in catalog.json.
          </Typography>
        </Box>
      )}
    </Section>
  );
}