import { AppBar, Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography, Divider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ForestIcon from "@mui/icons-material/Forest";
import LayersIcon from "@mui/icons-material/Layers";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import type { FloorCategory } from "../types/catalog";
import { isAdminAuthorized } from "../utils/adminGate";
import { sortCategories } from "../utils/categoryOrder";
import { assetUrl } from "../utils/assetUrl";

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
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);
  const [brandAnchorEl, setBrandAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<FloorCategory | null>(null);
  const [selectedType, setSelectedType] = useState<any>(null);

  const open = Boolean(anchorEl);
  const typeOpen = Boolean(typeAnchorEl);
  const brandOpen = Boolean(brandAnchorEl);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
  });

  const catItems = useMemo(() => sortCategories(categories ?? []), [categories]);

  const handleCategoryHover = (event: React.MouseEvent<HTMLElement>, category: FloorCategory) => {
    setSelectedCategory(category);
    if (category.subcategories && category.subcategories.length > 0) {
      setTypeAnchorEl(event.currentTarget);
    }
  };

  const handleTypeHover = (event: React.MouseEvent<HTMLElement>, type: any) => {
    setSelectedType(type);
    if (type.subsubcategories && type.subsubcategories.length > 0) {
      setBrandAnchorEl(event.currentTarget);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setAnchorEl(null);
    setTypeAnchorEl(null);
    setBrandAnchorEl(null);
    setSelectedCategory(null);
    setSelectedType(null);
  };

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
              onClose={() => {
                setAnchorEl(null);
                setTypeAnchorEl(null);
                setBrandAnchorEl(null);
                setSelectedCategory(null);
                setSelectedType(null);
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { borderRadius: 3, minWidth: 320 } }}
              onMouseLeave={() => {
                setTypeAnchorEl(null);
                setBrandAnchorEl(null);
              }}
            >
              {/* Categories */}
              {catItems.map((c) => (
                <MenuItem
                  key={c.id}
                  component={RouterLink}
                  to={`/catalog?category=${encodeURIComponent(c.id)}`}
                  onClick={() => handleCategoryClick(c.id)}
                  onMouseEnter={(e) => handleCategoryHover(e, c)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pr: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ListItemIcon sx={{ minWidth: 34 }}>{categoryIcon(c.name)}</ListItemIcon>
                    <Typography>{c.name}</Typography>
                  </Box>
                  {c.subcategories && c.subcategories.length > 0 && (
                    <ChevronRightIcon fontSize="small" sx={{ opacity: 0.5 }} />
                  )}
                </MenuItem>
              ))}

              <Divider sx={{ my: 0.5 }} />

              <MenuItem component={RouterLink} to="/brands" onClick={() => handleCategoryClick("")}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <StorefrontIcon fontSize="small" />
                </ListItemIcon>
                Popular brands
              </MenuItem>

              <MenuItem component={RouterLink} to="/deals" onClick={() => handleCategoryClick("")}>
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <LocalOfferIcon fontSize="small" />
                </ListItemIcon>
                Hot deals
              </MenuItem>
            </Menu>

            {/* Types Submenu */}
            {selectedCategory && (
              <Menu
                anchorEl={typeAnchorEl}
                open={typeOpen}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{ sx: { borderRadius: 3, minWidth: 260 } }}
                onMouseLeave={() => {
                  setTypeAnchorEl(null);
                  setBrandAnchorEl(null);
                }}
              >
                {(selectedCategory.subcategories ?? []).map((type) => (
                  <MenuItem
                    key={type.id}
                    component={RouterLink}
                    to={`/catalog?category=${encodeURIComponent(selectedCategory.id)}&subcategory=${encodeURIComponent(type.id)}`}
                    onClick={() => handleCategoryClick(selectedCategory.id)}
                    onMouseEnter={(e) => handleTypeHover(e, type)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pr: 1,
                    }}
                  >
                    <Typography variant="body2">{type.name}</Typography>
                    {type.subsubcategories && type.subsubcategories.length > 0 && (
                      <ChevronRightIcon fontSize="small" sx={{ opacity: 0.5 }} />
                    )}
                  </MenuItem>
                ))}
              </Menu>
            )}

            {/* Brands Submenu */}
            {selectedType && (
              <Menu
                anchorEl={brandAnchorEl}
                open={brandOpen}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{ sx: { borderRadius: 3, minWidth: 220 } }}
              >
                {(selectedType.subsubcategories ?? []).map((brand: any) => (
                  <MenuItem
                    key={brand.id}
                    component={RouterLink}
                    to={`/catalog?category=${encodeURIComponent(selectedCategory?.id || "")}&subcategory=${encodeURIComponent(selectedType?.id || "")}&subsubcategory=${encodeURIComponent(brand.id)}`}
                    onClick={() => handleCategoryClick(selectedCategory?.id || "")}
                  >
                    <Typography variant="body2">{brand.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}

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
