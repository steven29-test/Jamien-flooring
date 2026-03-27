import {
  Box, Card, CardContent, CardMedia, Chip, Divider, 
  Stack, Typography, Grid, Container, Button, Menu, MenuItem
} from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Section from "../components/Section";
import type { CatalogData } from "../types/catalog";
import { sortCategories } from "../utils/categoryOrder";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { assetUrl } from "../utils/assetUrl";

type Props = { catalog: CatalogData };

export default function Catalog({ catalog }: Props) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("category") ?? "all";
  const subcategoryId = params.get("subcategory") ?? "all";
  const subsubcategoryId = params.get("subsubcategory") ?? "all";

  const [catAnchor, setCatAnchor] = useState<null | HTMLElement>(null);
  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);
  const [brandAnchor, setBrandAnchor] = useState<null | HTMLElement>(null);

  const catItems = useMemo(() => sortCategories(catalog.categories ?? []), [catalog.categories]);

  const categories = useMemo(
    () => [{ id: "all", name: "All Categories" }, ...catItems],
    [catItems]
  );

  const types = useMemo(() => {
    if (categoryId === "all") return [];
    const cat = catalog.categories.find((c) => c.id === categoryId);
    return [{ id: "all", name: "All Types" }, ...(cat?.subcategories ?? [])];
  }, [catalog.categories, categoryId]);

  const brands = useMemo(() => {
    if (subcategoryId === "all" || !subcategoryId) return [];
    const cat = catalog.categories.find((c) => c.id === categoryId);
    const type = cat?.subcategories?.find((s) => s.id === subcategoryId);
    return [{ id: "all", name: "All Brands" }, ...(type?.subsubcategories ?? [])];
  }, [catalog.categories, categoryId, subcategoryId]);

  const filtered = useMemo(() => {
    return catalog.items
      .filter((i) => (categoryId === "all" ? true : i.categoryId === categoryId))
      .filter((i) => {
        if (subcategoryId === "all" || !subcategoryId) return true;
        return i.subcategoryId === subcategoryId;
      })
      .filter((i) => {
        if (subsubcategoryId === "all" || !subsubcategoryId) return true;
        return i.subsubcategoryId === subsubcategoryId;
      });
  }, [catalog.items, categoryId, subcategoryId, subsubcategoryId]);

  const catName = (id: string) => catalog.categories.find((c) => c.id === id)?.name ?? id;
  const subcatName = (id: string) => {
    const cat = catalog.categories.find((c) => c.id === categoryId);
    return cat?.subcategories?.find((s) => s.id === id)?.name ?? id;
  };
  const subsubcatName = (id: string) => {
    const cat = catalog.categories.find((c) => c.id === categoryId);
    const subcat = cat?.subcategories?.find((s) => s.id === subcategoryId);
    return subcat?.subsubcategories?.find((ss) => ss.id === id)?.name ?? id;
  };

  const handleCategoryChange = (newCatId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("subcategory");
    nextParams.delete("subsubcategory");
    if (newCatId === "all") nextParams.delete("category");
    else nextParams.set("category", newCatId);
    setParams(nextParams, { replace: true });
    setCatAnchor(null);
  };

  const handleTypeChange = (newTypeId: string) => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("subsubcategory");
    if (newTypeId === "all") nextParams.delete("subcategory");
    else nextParams.set("subcategory", newTypeId);
    setParams(nextParams, { replace: true });
    setTypeAnchor(null);
  };

  const handleBrandChange = (newBrandId: string) => {
    const nextParams = new URLSearchParams(params);
    if (newBrandId === "all") nextParams.delete("subsubcategory");
    else nextParams.set("subsubcategory", newBrandId);
    setParams(nextParams, { replace: true });
    setBrandAnchor(null);
  };

  return (
    <Section title="Floors" subtitle={`Browse our range in ${catalog.serviceArea}.`}>
      <Container maxWidth="lg" disableGutters>
        <Box>
          {/* Filter Bar */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2}
            sx={{ 
              mb: 4,
              p: 2.5,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              border: "1px solid #e5e5e5"
            }}
          >
            {/* Category Filter */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", textTransform: "uppercase", fontSize: "0.7rem", display: "block", mb: 0.8 }}>
                Category
              </Typography>
              <Button
                onClick={(e) => setCatAnchor(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  width: "100%",
                  justifyContent: "space-between",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#333",
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#fff",
                    borderColor: "#1976D2"
                  }
                }}
              >
                {categoryId === "all" ? "All Categories" : catName(categoryId)}
              </Button>
              <Menu anchorEl={catAnchor} open={Boolean(catAnchor)} onClose={() => setCatAnchor(null)}>
                {categories.map((cat) => (
                  <MenuItem 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.id)}
                    selected={cat.id === categoryId}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Type Filter */}
            {categoryId !== "all" && types.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", textTransform: "uppercase", fontSize: "0.7rem", display: "block", mb: 0.8 }}>
                  Type / Size
                </Typography>
                <Button
                  onClick={(e) => setTypeAnchor(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "#333",
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#fff",
                      borderColor: "#1976D2"
                    }
                  }}
                >
                  {subcategoryId === "all" ? "All Types" : subcatName(subcategoryId)}
                </Button>
                <Menu anchorEl={typeAnchor} open={Boolean(typeAnchor)} onClose={() => setTypeAnchor(null)}>
                  {types.map((type) => (
                    <MenuItem 
                      key={type.id} 
                      onClick={() => handleTypeChange(type.id)}
                      selected={type.id === subcategoryId}
                    >
                      {type.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}

            {/* Brand Filter */}
            {subcategoryId !== "all" && subcategoryId && brands.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", textTransform: "uppercase", fontSize: "0.7rem", display: "block", mb: 0.8 }}>
                  Brand
                </Typography>
                <Button
                  onClick={(e) => setBrandAnchor(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "#333",
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#fff",
                      borderColor: "#1976D2"
                    }
                  }}
                >
                  {subsubcategoryId === "all" ? "All Brands" : subsubcatName(subsubcategoryId)}
                </Button>
                <Menu anchorEl={brandAnchor} open={Boolean(brandAnchor)} onClose={() => setBrandAnchor(null)}>
                  {brands.map((brand) => (
                    <MenuItem 
                      key={brand.id} 
                      onClick={() => handleBrandChange(brand.id)}
                      selected={brand.id === subsubcategoryId}
                    >
                      {brand.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Stack>

          {/* Product Count */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: "#555", 
              mb: 3,
              fontSize: "0.95rem"
            }}
          >
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </Typography>

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <Grid container spacing={3}>
              {filtered.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card 
                    onClick={() => navigate(`/product/${item.id}?${params.toString()}`)}
                    sx={{ 
                      height: "100%",
                      borderRadius: 0.5,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      border: "1px solid #f0f0f0",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        transform: "translateY(-4px)"
                      },
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Image */}
                    {(item.images?.[0] ?? item.imageUrl) ? (
                      <CardMedia 
                        component="img" 
                        height="240" 
                        image={assetUrl((item.images?.[0] ?? item.imageUrl) || "")} 
                        alt={item.name}
                        sx={{
                          objectFit: "cover",
                          backgroundColor: "#f5f5f5"
                        }}
                      />
                    ) : (
                      <Box sx={{ height: 240, bgcolor: "#f5f5f5" }} />
                    )}

                    {/* Content */}
                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: "1rem",
                          mb: 0.5,
                          color: "#333",
                          lineHeight: 1.3
                        }}
                      >
                        {item.name}
                      </Typography>

                      {item.subtitle && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#999",
                            fontSize: "0.85rem",
                            mb: 1.5
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      )}

                      {/* Specs */}
                      {(item.specs?.length ?? 0) > 0 && (
                        <Stack spacing={0.5} sx={{ mb: 2 }}>
                          {item.specs!.slice(0, 2).map((s, idx) => (
                            <Typography 
                              key={idx} 
                              variant="caption" 
                              sx={{ 
                                color: "#666",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5
                              }}
                            >
                              <span style={{ color: "#1976D2", fontWeight: 600 }}>•</span> {s}
                            </Typography>
                          ))}
                        </Stack>
                      )}

                      {/* Price */}
                      {item.priceHint && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700,
                            color: "#1976D2",
                            fontSize: "0.95rem",
                            mb: 1.5
                          }}
                        >
                          {item.priceHint}
                        </Typography>
                      )}

                      {/* Tags */}
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
                        {item.brand && (
                          <Chip 
                            label={item.brand} 
                            size="small" 
                            variant="outlined"
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              borderColor: "#d0d0d0",
                              color: "#666"
                            }}
                          />
                        )}
                        {item.featured && (
                          <Chip 
                            label="Featured" 
                            size="small" 
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: "#fff3e0",
                              color: "#E65100"
                            }}
                          />
                        )}
                        {item.isDeal && (
                          <Chip 
                            label="Deal" 
                            size="small" 
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: "#fce4ec",
                              color: "#C2185B"
                            }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body2" color="text.secondary">
                No products found
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Section>
  );
}
