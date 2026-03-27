import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Menu, 
  Stack, 
  Toolbar, 
  Typography, 
  Divider,
  Paper,
  Grid,
  Chip
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ForestIcon from "@mui/icons-material/Forest";
import LayersIcon from "@mui/icons-material/Layers";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink, useLocation, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { FloorCategory } from "../types/catalog";
import { isAdminAuthorized } from "../utils/adminGate";
import { sortCategories } from "../utils/categoryOrder";

type Props = { businessName: string; logoUrl?: string; categories: FloorCategory[] };

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";

function categoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("engineered")) return <ForestIcon />;
  if (n.includes("hybrid") || n.includes("vinyl")) return <WaterDropIcon />;
  if (n.includes("laminate")) return <LayersIcon />;
  if (n.includes("solid")) return <ForestIcon />;
  if (n.includes("herringbone") || n.includes("chevron")) return <GridOnIcon />;
  return <ViewQuiltIcon />;
}

export default function NavBar({ businessName, logoUrl, categories }: Props) {
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
    transition: "opacity 0.2s ease",
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

  const selectedCategory = catItems.find(c => c.id === params.get("category"));

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5 }}>
          {/* Logo & Brand */}
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "text.primary" }}
          >
            {logoUrl ? (
              <Box component="img" src={logoUrl} alt={`${businessName} logo`} sx={{ width: 40, height: 40, objectFit: "contain" }} />
            ) : null}
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5, fontSize: "1.1rem" }}>
              {businessName}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Button 
              component={RouterLink} 
              to="/" 
              color="inherit" 
              sx={{
                ...linkSx(pathname === "/"),
                textTransform: "none",
                fontSize: "0.95rem",
                px: 2,
                py: 1,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1 }
              }}
            >
              Home
            </Button>

            {/* Products Dropdown */}
            <Button
              color="inherit"
              endIcon={<KeyboardArrowDownIcon sx={{ transition: "transform 0.3s" }} />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                ...linkSx(pathname.startsWith("/catalog") || pathname.startsWith("/brands") || pathname.startsWith("/deals")),
                textTransform: "none",
                fontSize: "0.95rem",
                px: 2,
                py: 1,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1 }
              }}
            >
              Products
            </Button>

            {/* Mega Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setAnchorEl(null);
                setHoveredCategory(null);
                setHoveredType(null);
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setHoveredType(null);
              }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  minWidth: 1000,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  mt: 0.5,
                  overflow: "visible"
                }
              }}
              MenuListProps={{
                onMouseLeave: () => {
                  setHoveredCategory(null);
                  setHoveredType(null);
                }
              }}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, p: 0 }}>
                {/* Left Panel - Categories */}
                <Box sx={{ borderRight: "1px solid #e0e0e0", p: 2, backgroundColor: "#fafafa" }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 900, 
                      color: "#666", 
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      display: "block",
                      mb: 1.5,
                      fontSize: "0.7rem"
                    }}
                  >
                    Categories
                  </Typography>

                  <Stack spacing={0.5}>
                    {catItems.map((category) => (
                      <Box
                        key={category.id}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onClick={() => handleCategoryClick(category.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          backgroundColor: hoveredCategory === category.id ? "#E3F2FD" : "transparent",
                          border: hoveredCategory === category.id ? "1px solid #2196F3" : "1px solid transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#E3F2FD",
                            border: "1px solid #2196F3",
                          },
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5
                        }}
                      >
                        <Box sx={{ color: "#2196F3", display: "flex", fontSize: "1.4rem" }}>
                          {categoryIcon(category.name)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: hoveredCategory === category.id ? 700 : 600,
                              color: hoveredCategory === category.id ? "#1976D2" : "#333"
                            }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                        {(category.subcategories ?? []).length > 0 && (
                          <ChevronRightIcon sx={{ fontSize: "1.2rem", color: "#999" }} />
                        )}
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    component={RouterLink}
                    to="/brands"
                    onClick={() => setAnchorEl(null)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      textDecoration: "none",
                      color: "inherit"
                    }}
                  >
                    <Box sx={{ color: "#FF9800", display: "flex", fontSize: "1.4rem" }}>
                      <StorefrontIcon />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                      Popular Brands
                    </Typography>
                  </Box>

                  <Box
                    component={RouterLink}
                    to="/deals"
                    onClick={() => setAnchorEl(null)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      textDecoration: "none",
                      color: "inherit",
                      mt: 0.5
                    }}
                  >
                    <Box sx={{ color: "#E91E63", display: "flex", fontSize: "1.4rem" }}>
                      <LocalOfferIcon />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                      Hot Deals
                    </Typography>
                  </Box>
                </Box>

                {/* Right Panel - Types & Variants */}
                {hoveredCategory && (
                  <Box sx={{ p: 3, backgroundColor: "#fff" }}>
                    {catItems.find(c => c.id === hoveredCategory)?.subcategories && 
                      (catItems.find(c => c.id === hoveredCategory)?.subcategories?.length ?? 0) > 0 ? (
                      <Grid container spacing={3}>
                        {(catItems.find(c => c.id === hoveredCategory)?.subcategories ?? []).map((type) => (
                          <Grid item xs={12} sm={6} key={type.id}>
                            {/* Type Header */}
                            <Box
                              onMouseEnter={() => setHoveredType(type.id)}
                              onClick={() => handleTypeClick(
                                hoveredCategory,
                                type.id
                              )}
                              sx={{
                                cursor: "pointer",
                                mb: 1.5,
                                pb: 1.5,
                                borderBottom: "2px solid #4CAF50",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderBottomColor: "#2E7D32",
                                }
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: "#2E7D32",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.8
                                }}
                              >
                                <span style={{ fontSize: "1.2rem" }}>🟢</span> {type.name}
                              </Typography>
                            </Box>

                            {/* Variants List */}
                            {(type.subsubcategories ?? []).length > 0 && (
                              <Stack spacing={0.8}>
                                {(type.subsubcategories ?? []).map((variant) => (
                                  <Box
                                    key={variant.id}
                                    onClick={() => handleVariantClick(hoveredCategory, type.id, variant.id)}
                                    sx={{
                                      p: 1,
                                      borderRadius: 0.8,
                                      cursor: "pointer",
                                      backgroundColor: hoveredType === type.id ? "#FFF3E0" : "transparent",
                                      border: hoveredType === type.id ? "1px solid #FF9800" : "1px solid transparent",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: "#FFF3E0",
                                        border: "1px solid #FF9800",
                                        pl: 1.5
                                      }
                                    }}
                                  >
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontWeight: 500,
                                        color: "#E65100",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.6
                                      }}
                                    >
                                      <span style={{ fontSize: "1rem" }}>🟠</span> {variant.name}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        No types available for this category
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Default view when no category hovered */}
                {!hoveredCategory && (
                  <Box sx={{ p: 3, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                      Select a category to view types and variants
                    </Typography>
                  </Box>
                )}
              </Box>
            </Menu>

            <Button 
              component={RouterLink} 
              to="/contact" 
              color="inherit" 
              sx={{
                ...linkSx(pathname === "/contact"),
                textTransform: "none",
                fontSize: "0.95rem",
                px: 2,
                py: 1,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1 }
              }}
            >
              Contact
            </Button>

            {ADMIN_ENABLED && isAdminAuthorized() ? (
              <Button 
                component={RouterLink} 
                to="/admin" 
                variant="contained" 
                disableElevation 
                sx={{ 
                  fontWeight: 900,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  ml: 0.5
                }}
              >
                Admin
              </Button>
            ) : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
