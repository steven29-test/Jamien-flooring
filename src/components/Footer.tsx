import { Box, Container, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  businessName: string;
  serviceArea: string;
  phone?: string;
  email?: string;
  address?: string;
};

const SUBURBS = [
  "Lane Cove",
  "Artarmon",
  "Chatswood",
  "Willoughby",
  "St Leonards",
  "Crows Nest",
  "Cammeray",
  "North Sydney",
  "Neutral Bay",
  "Cremorne",
  "Mosman",
  "Kirribilli",
  "Waverton",
  "Lindfield",
  "Roseville",
  "Killara",
  "Gordon",
  "Pymble",
  "Turramurra",
  "Wahroonga",
  "St Ives"
];

export default function Footer({ businessName, serviceArea, phone, email, address }: Props) {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ mt: 6, pt: 5, pb: 4, bgcolor: "rgba(11,31,58,0.04)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {businessName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
              Premium timber craftsmanship, with great-value options for every budget. Serving {serviceArea}.
            </Typography>

            <Stack spacing={0.6} sx={{ mt: 2 }}>
              {address ? (
                <Typography variant="body2">
                  <b>Address:</b> {address}
                </Typography>
              ) : null}
              {phone ? (
                <Typography variant="body2">
                  <b>Phone:</b> {phone}
                </Typography>
              ) : null}
              {email ? (
                <Typography variant="body2">
                  <b>Email:</b> {email}
                </Typography>
              ) : null}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Quick links</Typography>
            <Stack spacing={0.7}>
              <Link component={RouterLink} to="/" underline="hover">Home</Link>
              <Link component={RouterLink} to="/catalog" underline="hover">Products</Link>
              <Link component={RouterLink} to="/brands" underline="hover">Popular brands</Link>
              <Link component={RouterLink} to="/deals" underline="hover">Hot deals</Link>
              <Link component={RouterLink} to="/contact" underline="hover">Contact</Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Sydney North Shore service suburbs</Typography>
            <Typography variant="body2" color="text.secondary">
              {SUBURBS.slice(0, 10).join(", ")}…
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {SUBURBS.slice(10).join(", ")}.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            © {year} {businessName}. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
