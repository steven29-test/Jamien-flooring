import { AppBar, Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Typography, Divider, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ForestIcon from "@mui/icons-material/Forest";
import LayersIcon from "@mui/icons-material/Layers";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
  });

  const catItems = useMemo(() => sortCategories(categories ?? []), [categories]);

  const handleCategoryClick = (catId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("cat");
    nextParams.delete("subcategory");
    nextParams.delete("subsubcategory");
    if (catId === "all") nextParams.delete("category");
    else nextParams.set("category", catId);
    setParams(nextParams, { replace: true });
    setAnchorEl(null);
  };

  const handleTypeClick = (catId: string, typeId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("category", catId);
    nextParams.set("subcategory", typeId);
    nextParams.delete("subsubcategory");
    setParams(nextParams, { replace: true });
    setAnchorEl(null);
  };

  const handleVariantClick = (catId: string, typeId: string, variantId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("category", catId);
    nextParams.set("subcategory", typeId);
    nextParams.set("subsubcategory", variantId);
    setParams(nextParams, { replace: true });
    setAnchorEl(null);
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
              PaperProps={{ sx: { borderRadius: 3, minWidth: 500, maxHeight: 500 } }}
            >
              {/* Categories with nested Types and Variants */}
              {catItems.map((category) => (
                <Box key={category.id}>
                  {/* Category Header */}
                  <MenuItem
                    onClick={() => {
                      handleCategoryClick(category.id);
                    }}
                    sx={{
                      backgroundColor: "#E3F2FD",
                      fontWeight: 700,
                      "&:hover": { backgroundColor: "#BBDEFB" }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34 }}>{categoryIcon(category.name)}</ListItemIcon>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      🔵 {category.name}
                    </Typography>
                  </MenuItem>

                  {/* Types under Category */}
                  {(category.subcategories ?? []).length > 0 && (
                    <Box sx={{ pl: 4 }}>
                      {(category.subcategories ?? []).map((type) => (
                        <Box key={type.id}>
                          {/* Type Header with expand/collapse */}
                          <MenuItem
                            onClick={() => {
                              setExpandedType(expandedType === type.id ? null : type.id);
                            }}
                            sx={{
                              backgroundColor: "#E8F5E9",
                              py: 0.8,
                              "&:hover": { backgroundColor: "#C8E6C9" }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              {expandedType === type.id ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )}
                            </ListItemIcon>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              🟢 {type.name}
                            </Typography>
                          </MenuItem>

                          {/* Variants under Type */}
                          {expandedType === type.id && (type.subsubcategories ?? []).length > 0 && (
                            <Box sx={{ pl: 4 }}>
                              {(type.subsubcategories ?? []).map((variant) => (
                                <MenuItem
                                  key={variant.id}
                                  onClick={() => {
                                    handleVariantClick(category.id, type.id, variant.id);
                                  }}
                                  sx={{
                                    backgroundColor: "#FFF3E0",
                                    py: 0.6,
                                    fontSize: "0.9rem",
                                    "&:hover": { backgroundColor: "#FFE0B2" }
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    🟠 {variant.name}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}

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
