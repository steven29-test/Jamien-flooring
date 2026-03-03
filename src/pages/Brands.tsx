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

function pickImageForBrand(brand: string) {
  const map: Record<string, string> = {
    "Quick-Step": "images/laminate-2.jpg",
    "Godfrey Hirst": "images/hybrid-2.jpg",
    "Preference Floors": "images/engineered-1.jpg",
    "Premium Oak Co.": "images/engineered-3.jpg",
  };
  return assetUrl(map[brand] ?? "images/hybrid-1.jpg");
}

export default function Brands({ catalog }: Props) {
  const brands = Array.from(
    new Set((catalog.items ?? []).map((i) => i.brand).filter(Boolean) as string[])
  ).sort();

  return (
    <Section
      title="Popular brands"
      subtitle="Sample brand list (edit products and brands later in Admin or catalog.json)."
    >
      <Grid container spacing={2}>
        {brands.map((b) => (
          <Grid item xs={12} sm={6} md={3} key={b}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardMedia component="img" height="160" image={pickImageForBrand(b)} alt={b} />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {b}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Popular styles across Sydney homes.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                  <Chip size="small" label="In-stock options" />
                  <Chip size="small" variant="outlined" label="Request pricing" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {brands.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography color="text.secondary">
            No brands found yet. Add a <b>brand</b> field to items in catalog.json.
          </Typography>
        </Box>
      )}
    </Section>
  );
}