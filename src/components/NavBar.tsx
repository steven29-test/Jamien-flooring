import { AppBar, Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography, FormControl, InputLabel, Select, Divider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ForestIcon from "@mui/icons-material/Forest";
import LayersIcon from "@mui/icons-material/Layers";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { Link as RouterLink, useLocation, useSearchParams } from "react-router-dom";
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
  const [params, setParams] = useSearchParams();
  const urlCat = params.get("category") ?? params.get("cat") ?? "all";
  const urlSubcat = params.get("subcategory") ?? "all";
  const urlSubsubcat = params.get("subsubcategory") ?? "all";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [categoryId, setCategoryId] = useState<string>(urlCat);
  const [subcategoryId, setSubcategoryId] = useState<string>(urlSubcat);
  const [subsubcategoryId, setSubsubcategoryId] = useState<string>(urlSubsubcat);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
  });

  const catItems = useMemo(() => sortCategories(categories ?? []), [categories]);

  const subcategories = useMemo(() => {
    if (categoryId === "all") return [];
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.subcategories ?? [];
  }, [categories, categoryId]);

  const subsubcategories = useMemo(() => {
    if (subcategoryId === "all" || !subcategoryId) return [];
    const cat = categories.find((c) => c.id === categoryId);
    const subcat = cat?.subcategories?.find((s) => s.id === subcategoryId);
    return subcat?.subsubcategories ?? [];
  }, [categories, categoryId, subcategoryId]);

  const handleCategoryClick = (catId: string) => {
    setCategoryId(catId);
    setSubcategoryId("all");
    setSubsubcategoryId("all");
    const nextParams = new URLSearchParams(params);
    nextParams.delete("cat");
    nextParams.delete("subcategory");
    nextParams.delete("subsubcategory");
    if (catId === "all") nextParams.delete("category");
    else nextParams.set("category", catId);
    setParams(nextParams, { replace: true });
  };

  const handleTypeChange = (typeId: string) => {
    setSubcategoryId(typeId);
    setSubsubcategoryId("all");
    const nextParams = new URLSearchParams(params);
    nextParams.delete("subsubcategory");
    if (typeId === "all") nextParams.delete("subcategory");
    else nextParams.set("subcategory", typeId);
    setParams(nextParams, { replace: true });
  };

  const handleVariantChange = (variantId: string) => {
    setSubsubcategoryId(variantId);
    const nextParams = new URLSearchParams(params);
    if (variantId === "all") nextParams.delete("subsubcategory");
    else nextParams.set("subsubcategory", variantId);
    setParams(nextParams, { replace: true });
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
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}
            >
              {/* Categories List */}
              <Box sx={{ px: 1, py: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", display: "block", mb: 1 }}>
                  📁 CATEGORIES
                </Typography>
                {catItems.map((c) => (
                  <MenuItem
                    key={c.id}
                    onClick={() => {
                      handleCategoryClick(c.id);
                      setAnchorEl(null);
                    }}
                    sx={{ backgroundColor: categoryId === c.id ? "#E3F2FD" : "transparent" }}
                  >
                    <ListItemIcon sx={{ minWidth: 34 }}>{categoryIcon(c.name)}</ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: categoryId === c.id ? 700 : 500 }}>
                      {c.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>

              {/* Types Dropdown */}
              {subcategories.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", display: "block", mb: 1 }}>
                      🟢 TYPES
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="nav-type-label">Select Type</InputLabel>
                      <Select
                        labelId="nav-type-label"
                        value={subcategoryId}
                        label="Select Type"
                        onChange={(e) => handleTypeChange(e.target.value)}
                      >
                        <MenuItem value="all">All types</MenuItem>
                        {subcategories.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}

              {/* Variants Dropdown */}
              {subsubcategories.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", display: "block", mb: 1 }}>
                      🟠 VARIANTS
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="nav-variant-label">Select Variant</InputLabel>
                      <Select
                        labelId="nav-variant-label"
                        value={subsubcategoryId}
                        label="Select Variant"
                        onChange={(e) => handleVariantChange(e.target.value)}
                      >
                        <MenuItem value="all">All variants</MenuItem>
                        {subsubcategories.map((ss) => (
                          <MenuItem key={ss.id} value={ss.id}>
                            {ss.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 1 }} />

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
