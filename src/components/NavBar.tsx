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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import type { FloorCategory } from "../types/catalog";
import { isAdminAuthorized } from "../utils/adminGate";
import { sortCategories } from "../utils/categoryOrder";

type Props = { businessName: string; logoUrl?: string; categories: FloorCategory[] };

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";

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
      onMouseLeave={() => setHoveredCategory(null)}
      PaperProps={{
        sx: {
          borderRadius: 0,
          width: 900,
          maxWidth: "calc(100vw - 32px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          mt: 0.5,
          overflow: "visible",
          border: "1px solid #e5e5e5"
        }
      }}
      MenuListProps={{
        onMouseLeave: () => setHoveredCategory(null),
        sx: { p: 0 }
      }}
    >
      <Box sx={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, p: 0, minHeight: 400 }}>
        {/* Left Panel - Categories */}
        <Box sx={{ 
          borderRight: "1px solid #e5e5e5", 
          p: 0,
          backgroundColor: "#f8f9fa",
          maxHeight: 600,
          overflow: "auto"
        }}>
          {catItems.map((category, index) => (
            <Box
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                px: 3,
                py: 2.5,
                cursor: "pointer",
                backgroundColor: hoveredCategory === category.id ? "#fff" : "transparent",
                borderLeft: hoveredCategory === category.id ? "4px solid #2C5F7D" : "4px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#fff",
                  borderLeftColor: "#2C5F7D",
                },
                borderBottom: index < catItems.length - 1 ? "1px solid #eeeeee" : "none"
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: hoveredCategory === category.id ? 600 : 500,
                  color: hoveredCategory === category.id ? "#2C5F7D" : "#333",
                  fontSize: "0.95rem"
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Right Panel - Types & Variants */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: "#fff",
          maxHeight: 600,
          overflow: "auto"
        }}>
          {hoveredCategory ? (
            catItems.find(c => c.id === hoveredCategory)?.subcategories && 
            (catItems.find(c => c.id === hoveredCategory)?.subcategories?.length ?? 0) > 0 ? (
              <Box>
                {(catItems.find(c => c.id === hoveredCategory)?.subcategories ?? []).map((type) => (
                  <Box key={type.id} sx={{ mb: 3, pb: 3, borderBottom: "1px solid #e5e5e5", "&:last-child": { borderBottom: "none", mb: 0, pb: 0 } }}>
                    {/* Type Header */}
                    <Box
                      onClick={() => handleTypeClick(hoveredCategory, type.id)}
                      sx={{
                        cursor: "pointer",
                        mb: 1.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "#2C5F7D"
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#2C5F7D",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.5
                        }}
                      >
                        {type.name}
                      </Typography>
                    </Box>

                    {/* Variants List */}
                    {(type.subsubcategories ?? []).length > 0 && (
                      <Stack spacing={1}>
                        {(type.subsubcategories ?? []).map((variant) => (
                          <Box
                            key={variant.id}
                            onClick={() => handleVariantClick(hoveredCategory, type.id, variant.id)}
                            sx={{
                              px: 2,
                              py: 1.2,
                              borderRadius: 1,
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              transition: "all 0.2s ease",
                              border: "1px solid transparent",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e0e0e0"
                              }
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 500,
                                color: "#555",
                                fontSize: "0.85rem"
                              }}
                            >
                              {variant.name}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
                No subcategories available
              </Typography>
            )
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
              Select a category to view types and brands
            </Typography>
          )}
        </Box>
      </Box>
    </Menu>
  );

  // Mobile Drawer Menu
  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100vw",
          backgroundColor: "#fff"
        }
      }}
    >
      <Box sx={{ 
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #f0f0f0",
        backgroundColor: "#fff"
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#333" }}>
          Menu
        </Typography>
        <IconButton 
          onClick={() => setMobileDrawerOpen(false)}
          sx={{ color: "#555", p: 0.5 }}
        >
          <CloseIcon sx={{ fontSize: "1.5rem" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 0, overflow: "auto", maxHeight: "calc(100vh - 80px)" }}>
        <Stack spacing={0}>
          {/* Home Link */}
          <Button
            component={RouterLink}
            to="/"
            onClick={() => setMobileDrawerOpen(false)}
            fullWidth
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              py: 2.5,
              px: 3,
              color: "#333",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              borderBottom: "1px solid #f0f0f0",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f9f9f9"
              }
            }}
          >
            Home
          </Button>

          {/* Categories */}
          {catItems.map((category) => (
            <Box key={category.id}>
              <Button
                fullWidth
                onClick={() => {
                  if ((category.subcategories ?? []).length > 0) {
                    setExpandedMobileCategory(expandedMobileCategory === category.id ? null : category.id);
                  } else {
                    handleCategoryClick(category.id);
                  }
                }}
                sx={{
                  textAlign: "left",
                  justifyContent: "space-between",
                  py: 2.5,
                  px: 3,
                  color: "#333",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  backgroundColor: expandedMobileCategory === category.id ? "#f0f7ff" : "transparent",
                  borderBottom: "1px solid #f0f0f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f0f7ff"
                  }
                }}
              >
                <span>{category.name}</span>
                {(category.subcategories ?? []).length > 0 && (
                  <Box sx={{ display: "flex", color: "#2C5F7D" }}>
                    {expandedMobileCategory === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                )}
              </Button>

              {/* Types */}
              <Collapse in={expandedMobileCategory === category.id} timeout="auto" unmountOnExit>
                <Box sx={{ backgroundColor: "#fafafa" }}>
                  {(category.subcategories ?? []).map((type) => (
                    <Box key={type.id}>
                      <Button
                        fullWidth
                        onClick={() => {
                          if ((type.subsubcategories ?? []).length > 0) {
                            setExpandedMobileType(expandedMobileType === type.id ? null : type.id);
                          } else {
                            handleTypeClick(category.id, type.id);
                          }
                        }}
                        sx={{
                          textAlign: "left",
                          justifyContent: "space-between",
                          py: 2,
                          px: 5,
                          color: "#555",
                          textTransform: "none",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          backgroundColor: expandedMobileType === type.id ? "#e3f2fd" : "transparent",
                          borderBottom: "1px solid #eeeeee",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#e3f2fd"
                          }
                        }}
                      >
                        <span>{type.name}</span>
                        {(type.subsubcategories ?? []).length > 0 && (
                          <Box sx={{ display: "flex", color: "#2C5F7D", fontSize: "1.2rem" }}>
                            {expandedMobileType === type.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </Box>
                        )}
                      </Button>

                      {/* Variants/Brands */}
                      <Collapse in={expandedMobileType === type.id} timeout="auto" unmountOnExit>
                        <Box sx={{ backgroundColor: "#fff" }}>
                          {(type.subsubcategories ?? []).map((variant) => (
                            <Button
                              key={variant.id}
                              fullWidth
                              onClick={() => handleVariantClick(category.id, type.id, variant.id)}
                              sx={{
                                textAlign: "left",
                                justifyContent: "space-between",
                                py: 1.8,
                                px: 7,
                                color: "#666",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                fontWeight: 400,
                                borderBottom: "1px solid #f5f5f5",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#f9f9f9",
                                  color: "#2C5F7D",
                                  fontWeight: 500
                                }
                              }}
                            >
                              {variant.name}
                            </Button>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))}

          {/* Divider */}
          <Divider sx={{ my: 1 }} />

          {/* Contact Link */}
          <Button
            component={RouterLink}
            to="/contact"
            onClick={() => setMobileDrawerOpen(false)}
            fullWidth
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              py: 2.5,
              px: 3,
              color: "#333",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              borderBottom: "1px solid #f0f0f0",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f9f9f9"
              }
            }}
          >
            Contact
          </Button>

          {/* Admin Link */}
          {ADMIN_ENABLED && isAdminAuthorized() && (
            <Button
              component={RouterLink}
              to="/admin"
              onClick={() => setMobileDrawerOpen(false)}
              fullWidth
              sx={{
                textAlign: "left",
                justifyContent: "flex-start",
                py: 2.5,
                px: 3,
                color: "#2C5F7D",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "#f0f7ff",
                borderBottom: "1px solid #f0f0f0",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#e3f2fd"
                }
              }}
            >
              Admin
            </Button>
          )}
        </Stack>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e5e5e5", backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo & Brand */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "text.primary", minWidth: 0 }}
          >
            {logoUrl ? (
              <Box component="img" src={logoUrl} alt={`${businessName} logo`} sx={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
            ) : null}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: 0.3,
                fontSize: { xs: "1rem", md: "1.1rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {businessName}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Button 
                component={RouterLink} 
                to="/" 
                color="inherit" 
                sx={{
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: pathname === "/" ? 600 : 500,
                  color: pathname === "/" ? "#2C5F7D" : "#555",
                  px: 2,
                  py: 1,
                  opacity: 1,
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#2C5F7D" }
                }}
              >
                Home
              </Button>

              <Button
                color="inherit"
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "1.2rem" }} />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: pathname.startsWith("/catalog") ? 600 : 500,
                  color: pathname.startsWith("/catalog") ? "#2C5F7D" : "#555",
                  px: 2,
                  py: 1,
                  opacity: 1,
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#2C5F7D" }
                }}
              >
                Products
              </Button>

              <Button 
                component={RouterLink} 
                to="/contact" 
                color="inherit" 
                sx={{
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: pathname === "/contact" ? 600 : 500,
                  color: pathname === "/contact" ? "#2C5F7D" : "#555",
                  px: 2,
                  py: 1,
                  opacity: 1,
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#2C5F7D" }
                }}
              >
                Contact
              </Button>

              {ADMIN_ENABLED && isAdminAuthorized() && (
                <Box sx={{ ml: 1 }}>
                  <Button 
                    component={RouterLink} 
                    to="/admin" 
                    variant="contained" 
                    disableElevation 
                    size="small"
                    sx={{ 
                      fontWeight: 600, 
                      textTransform: "none", 
                      fontSize: "0.9rem",
                      backgroundColor: "#2C5F7D",
                      color: "#fff",
                      px: 2,
                      py: 0.8,
                      transition: "all 0.2s ease",
                      "&:hover": { backgroundColor: "#1F4A61" }
                    }}
                  >
                    Admin
                  </Button>
                </Box>
              )}
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ ml: 1, color: "#555", p: 0.5 }}
            >
              <MenuIcon sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {desktopMenu}
      {mobileMenu}
    </AppBar>
  );
}
