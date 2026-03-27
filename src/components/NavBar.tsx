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
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText
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
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileType, setExpandedMobileType] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const linkSx = (active: boolean) => ({
    fontWeight: 800,
    opacity: active ? 1 : 0.86,
    transition: "opacity 0.2s ease",
  });

  const catItems = useMemo(() => sortCategories(categories ?? []), [categories]);

  const handleCategoryClick = (catId: string) => {
    navigate(`/catalog?category=${encodeURIComponent(catId)}`);
    setAnchorEl(null);
    setMobileDrawerOpen(false);
  };

  const handleTypeClick = (catId: string, typeId: string) => {
    navigate(`/catalog?category=${encodeURIComponent(catId)}&subcategory=${encodeURIComponent(typeId)}`);
    setAnchorEl(null);
    setMobileDrawerOpen(false);
  };

  const handleVariantClick = (catId: string, typeId: string, variantId: string) => {
    navigate(`/catalog?category=${encodeURIComponent(catId)}&subcategory=${encodeURIComponent(typeId)}&subsubcategory=${encodeURIComponent(variantId)}`);
    setAnchorEl(null);
    setMobileDrawerOpen(false);
  };

  // Desktop Mega Menu
  const desktopMenu = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => {
        setAnchorEl(null);
        setHoveredCategory(null);
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onMouseLeave={() => {
        setHoveredCategory(null);
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: "100vw",
          maxWidth: 900,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          mt: 0.5,
          overflow: "visible",
          left: "0 !important"
        }
      }}
      MenuListProps={{
        onMouseLeave: () => {
          setHoveredCategory(null);
        }
      }}
    >
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 0, p: 0 }}>
        {/* Left Panel - Categories */}
        <Box sx={{ borderRight: { xs: "none", md: "1px solid #e0e0e0" }, p: 2, backgroundColor: "#fafafa" }}>
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
                      color: hoveredCategory === category.id ? "#1976D2" : "#333",
                      fontSize: "0.85rem"
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", fontSize: "0.85rem" }}>
              Brands
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
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", fontSize: "0.85rem" }}>
              Deals
            </Typography>
          </Box>
        </Box>

        {/* Right Panel - Types & Variants */}
        {hoveredCategory && (
          <Box sx={{ p: 2, backgroundColor: "#fff", display: { xs: "none", md: "block" } }}>
            {catItems.find(c => c.id === hoveredCategory)?.subcategories && 
              (catItems.find(c => c.id === hoveredCategory)?.subcategories?.length ?? 0) > 0 ? (
              <Stack spacing={2}>
                {(catItems.find(c => c.id === hoveredCategory)?.subcategories ?? []).map((type) => (
                  <Box key={type.id}>
                    <Box
                      onClick={() => handleTypeClick(hoveredCategory, type.id)}
                      sx={{
                        cursor: "pointer",
                        mb: 1,
                        pb: 1,
                        borderBottom: "2px solid #4CAF50",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderBottomColor: "#2E7D32",
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700,
                          color: "#2E7D32",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>🟢</span> {type.name}
                      </Typography>
                    </Box>

                    {(type.subsubcategories ?? []).length > 0 && (
                      <Stack spacing={0.5}>
                        {(type.subsubcategories ?? []).map((variant) => (
                          <Box
                            key={variant.id}
                            onClick={() => handleVariantClick(hoveredCategory, type.id, variant.id)}
                            sx={{
                              p: 0.8,
                              borderRadius: 0.8,
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "#FFF3E0",
                                pl: 1
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
                              <span style={{ fontSize: "0.9rem" }}>🟠</span> {variant.name}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                No types available
              </Typography>
            )}
          </Box>
        )}

        {!hoveredCategory && (
          <Box sx={{ p: 2, backgroundColor: "#fff", display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              Select a category
            </Typography>
          </Box>
        )}
      </Box>
    </Menu>
  );

  // Mobile Drawer Menu
  const mobileMenu = (
    <Drawer
      anchor="top"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          overflow: "auto"
        }
      }}
    >
      <Box sx={{ p: 2, pt: 1 }}>
        <Stack spacing={0}>
          {catItems.map((category) => (
            <Box key={category.id}>
              <ListItemButton
                onClick={() => {
                  if ((category.subcategories ?? []).length > 0) {
                    setExpandedMobileCategory(expandedMobileCategory === category.id ? null : category.id);
                  } else {
                    handleCategoryClick(category.id);
                  }
                }}
                sx={{
                  backgroundColor: expandedMobileCategory === category.id ? "#E3F2FD" : "transparent",
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <Box sx={{ color: "#2196F3", display: "flex", mr: 1.5, fontSize: "1.2rem" }}>
                  {categoryIcon(category.name)}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
                {(category.subcategories ?? []).length > 0 && (
                  <Box sx={{ ml: "auto" }}>
                    {expandedMobileCategory === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                )}
              </ListItemButton>

              {/* Types */}
              <Collapse in={expandedMobileCategory === category.id} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 2, mt: 1 }}>
                  {(category.subcategories ?? []).map((type) => (
                    <Box key={type.id}>
                      <ListItemButton
                        onClick={() => {
                          if ((type.subsubcategories ?? []).length > 0) {
                            setExpandedMobileType(expandedMobileType === type.id ? null : type.id);
                          } else {
                            handleTypeClick(category.id, type.id);
                          }
                        }}
                        sx={{
                          backgroundColor: expandedMobileType === type.id ? "#E8F5E9" : "transparent",
                          borderRadius: 1,
                          mb: 0.5
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#2E7D32" }}>
                          🟢 {type.name}
                        </Typography>
                        {(type.subsubcategories ?? []).length > 0 && (
                          <Box sx={{ ml: "auto" }}>
                            {expandedMobileType === type.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </Box>
                        )}
                      </ListItemButton>

                      {/* Variants */}
                      <Collapse in={expandedMobileType === type.id} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 2, mt: 0.5 }}>
                          {(type.subsubcategories ?? []).map((variant) => (
                            <ListItemButton
                              key={variant.id}
                              onClick={() => handleVariantClick(category.id, type.id, variant.id)}
                              sx={{
                                backgroundColor: "#FFF3E0",
                                borderRadius: 1,
                                mb: 0.5
                              }}
                            >
                              <Typography variant="caption" sx={{ fontWeight: 500, color: "#E65100" }}>
                                🟠 {variant.name}
                              </Typography>
                            </ListItemButton>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <ListItemButton component={RouterLink} to="/brands" onClick={() => setMobileDrawerOpen(false)}>
            <StorefrontIcon sx={{ mr: 1.5, color: "#FF9800" }} />
            <Typography variant="body2">Brands</Typography>
          </ListItemButton>

          <ListItemButton component={RouterLink} to="/deals" onClick={() => setMobileDrawerOpen(false)}>
            <LocalOfferIcon sx={{ mr: 1.5, color: "#E91E63" }} />
            <Typography variant="body2">Deals</Typography>
          </ListItemButton>
        </Stack>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e0e0e0" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo & Brand */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "text.primary" }}
          >
            {logoUrl ? (
              <Box component="img" src={logoUrl} alt={`${businessName} logo`} sx={{ width: 36, height: 36, objectFit: "contain" }} />
            ) : null}
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5, fontSize: { xs: "0.95rem", md: "1.1rem" } }}>
              {businessName}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Button 
                component={RouterLink} 
                to="/" 
                color="inherit" 
                sx={{
                  ...linkSx(pathname === "/"),
                  textTransform: "none",
                  fontSize: "0.9rem",
                  px: 1.5
                }}
              >
                Home
              </Button>

              <Button
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  ...linkSx(pathname.startsWith("/catalog")),
                  textTransform: "none",
                  fontSize: "0.9rem",
                  px: 1.5
                }}
              >
                Products
              </Button>

              <Button 
                component={RouterLink} 
                to="/contact" 
                color="inherit" 
                sx={{
                  ...linkSx(pathname === "/contact"),
                  textTransform: "none",
                  fontSize: "0.9rem",
                  px: 1.5
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
                  sx={{ fontWeight: 900, textTransform: "none", fontSize: "0.9rem", ml: 0.5 }}
                >
                  Admin
                </Button>
              ) : null}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {desktopMenu}
      {mobileMenu}
    </AppBar>
  );
}
