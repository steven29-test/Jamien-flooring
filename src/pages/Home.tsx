import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link as RouterLink } from "react-router-dom";
import Section from "../components/Section";
import TrustBar from "../components/TrustBar";
import ReviewsSection from "../components/ReviewsSection";
import type { CatalogData } from "../types/catalog";
import { sortCategories } from "../utils/categoryOrder";
import { assetUrl } from "../utils/assetUrl";

type Props = { catalog: CatalogData };

export default function Home({ catalog }: Props) {
  const featured = catalog.items.filter((i) => i.featured).slice(0, 6);

  return (
    <>
      <Box sx={{ background: `radial-gradient(1200px 420px at 10% 0%, rgba(249,171,0,0.18) 0%, transparent 55%), radial-gradient(1100px 520px at 90% 10%, rgba(11,31,58,0.16) 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(247,248,250,1))` }}>
        <Section>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {catalog.hero.headline}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {catalog.hero.subheadline}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip color="primary" variant="outlined" label="Free measure & quote" />
                  <Chip color="primary" variant="outlined" label="Supply & install" />
                  <Chip label={catalog.serviceArea} />
                </Stack>

                <TrustBar serviceArea={catalog.serviceArea} />

                <Stack direction="row" spacing={1.5}>
                  <Button component={RouterLink} to="/catalog" variant="contained" disableElevation sx={{ fontWeight: 800 }}>
                    Browse floors
                  </Button>
                  <Button component={RouterLink} to="/contact" variant="outlined" sx={{ fontWeight: 800 }}>
                    Get a quote
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 2, bgcolor: "grey.100", aspectRatio: "16/10" }}>
                {catalog.hero.heroImageUrl ? (
                  <Box component="img" src={assetUrl(catalog.hero.heroImageUrl)} alt="Jamien Flooring hero" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                    <Typography color="text.secondary">Add a hero image in Admin → Export JSON</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Section>
      </Box>

      {catalog.about ? (
        <Section title={catalog.about.title} subtitle={catalog.about.note}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <List>
                    {catalog.about.bullets.map((b, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={b} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                    Quick quote tips
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Send your suburb, estimated m² (or a floor plan), and a couple of photos. We’ll recommend the best options for your home, then provide clear pricing and a clean install plan.
                  </Typography>
                  <Stack direction="row" spacing={1.2} sx={{ mt: 2 }}>
                    <Button component={RouterLink} to="/contact" variant="contained" disableElevation sx={{ fontWeight: 800 }}>
                      Contact now
                    </Button>
                    <Button component={RouterLink} to="/catalog" variant="outlined" sx={{ fontWeight: 800 }}>
                      View range
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Section>
      ) : null}

      <Section title="Flooring categories" subtitle="Pick a type to view options.">
        <Grid container spacing={2}>
          {sortCategories(catalog.categories).map((c) => (
            <Grid item xs={12} sm={6} md={3} key={c.id}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardActionArea component={RouterLink} to={`/catalog?cat=${c.id}`}>
                  {c.imageUrl ? <CardMedia component="img" height="150" image={assetUrl(c.imageUrl)} alt={c.name} /> : <Box sx={{ height: 150, bgcolor: "grey.100" }} />}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {c.name}
                    </Typography>
                    {c.description && (
                      <Typography variant="body2" color="text.secondary">
                        {c.description}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section title="Featured picks" subtitle="Popular choices for Sydney homes.">
        <Grid container spacing={2}>
          {featured.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                {(item.images?.[0] ?? item.imageUrl) ? <CardMedia component="img" height="180" image={(item.images?.[0] ?? item.imageUrl) as string} alt={item.name} /> : <Box sx={{ height: 180, bgcolor: "grey.100" }} />}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {item.name}
                  </Typography>
                  {item.subtitle && (
                    <Typography variant="body2" color="text.secondary">
                      {item.subtitle}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                    {item.priceHint && <Chip size="small" label={item.priceHint} />}
                    <Chip size="small" label="Request a quote" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>
<Section title="Project spotlight" subtitle="Premium timber craftsmanship + value options for every budget.">
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 4, overflow: "hidden", height: "100%" }}>
        <CardMedia component="img" height="240" image={assetUrl("images/engineered-2.jpg")} alt="Engineered timber project" />
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Chip label="Premium timber" />
            <Chip variant="outlined" label="Design-led finish" />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Engineered timber — elegant, stable, timeless
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Perfect for renovations where you want the natural timber look with reliable performance.
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 4, overflow: "hidden", height: "100%" }}>
        <CardMedia component="img" height="240" image={assetUrl("images/hybrid-3.jpg")} alt="Hybrid flooring project" />
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Chip label="Great value" />
            <Chip variant="outlined" label="Family & pets" />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Hybrid flooring — tough, water-resistant, easy care
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ideal for busy homes and investment properties. Great looks without the stress.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Section>

<Section>
  <ReviewsSection reviews={catalog.reviews ?? []} />
</Section>

</>
  );
}