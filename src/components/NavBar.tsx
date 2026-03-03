import { AppBar, Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ForestIcon from "@mui/icons-material/Forest";
import LayersIcon from "@mui/icons-material/Layers";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import type { FloorCategory } from "../types/catalog";
import { isAdminAuthorized } from "../utils/adminGate";
import { sortCategories } from "../utils/categoryOrder";

type Props = { businessName: string; logoUrl?: string; categories: FloorCategory[] };

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";

function categoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("engineered")) return <ForestIcon fontSize="small" />;
  if (n.includes("hybrid") || n.includes("vinyl")) return <WaterDropIcon fontSize="small" />;
  if (n.includes("laminate")) return <LayersIcon fontSize="small" />;
  if (n.includes("solid")) return <ForestIcon fontSize="small" />;
  if (n.includes("herringbone") || n.includes("chevron")) return <GridOnIcon fontSize="small" />;
  return <ViewQuiltIcon fontSize="small" />;
}

export default function NavBar({ businessName, logoUrl, categories }: Props) {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
  });

  const catItems = useMemo(() => sortCategories(categories ?? []), [categories]);

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "text.primary" }}
          >
            {logoUrl ? (
              <Box component="img" src={logoUrl} alt={`${businessName} logo`} sx={{ width: 34, height: 34 }} />
            ) : null}
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
              {businessName}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button component={RouterLink} to="/" color="inherit" sx={linkSx(pathname === "/")}>
              Home
            </Button>

            <Button
              color="inherit"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={linkSx(pathname.startsWith("/catalog") || pathname.startsWith("/brands") || pathname.startsWith("/deals"))}
            >
              Products
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { borderRadius: 3, minWidth: 260 } }}
            >
              {catItems.map((c) => (
                <MenuItem
                  key={c.id}
                  component={RouterLink}
                  to={`/catalog?category=${encodeURIComponent(c.id)}`}
                  onClick={() => setAnchorEl(null)}
                >
                  <ListItemIcon sx={{ minWidth: 34 }}>{categoryIcon(c.name)}</ListItemIcon>
                  {c.name}
                </MenuItem>
              ))}

              <Box sx={{ my: 0.5 }} />

              <MenuItem component={RouterLink} to="/brands" onClick={() => setAnchorEl(null)}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <StorefrontIcon fontSize="small" />
                </ListItemIcon>
                Popular brands
              </MenuItem>

              <MenuItem component={RouterLink} to="/deals" onClick={() => setAnchorEl(null)}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <LocalOfferIcon fontSize="small" />
                </ListItemIcon>
                Hot deals
              </MenuItem>
            </Menu>

            <Button component={RouterLink} to="/contact" color="inherit" sx={linkSx(pathname === "/contact")}>
              Contact
            </Button>

            {ADMIN_ENABLED && isAdminAuthorized() ? (
              <Button component={RouterLink} to="/admin" variant="contained" disableElevation sx={{ fontWeight: 900 }}>
                Admin
              </Button>
            ) : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
