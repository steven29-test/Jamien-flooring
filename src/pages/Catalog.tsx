import {
  Box, Card, CardContent, CardMedia, Chip, Divider, 
  Stack, Typography, Grid, Container
} from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import type { CatalogData } from "../types/catalog";
import { sortCategories } from "../utils/categoryOrder";

type Props = { catalog: CatalogData };

export default function Catalog({ catalog }: Props) {
  const [params] = useSearchParams();
  const categoryId = params.get("category") ?? "all";
  const subcategoryId = params.get("subcategory") ?? "all";
  const subsubcategoryId = params.get("subsubcategory") ?? "all";

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

  // Breadcrumb navigation
  const breadcrumb = (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, flexWrap: "wrap", gap: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500, color: "#1976D2" }}>
        All Products
      </Typography>
      {categoryId !== "all" && (
        <>
          <Typography variant="body2" sx={{ color: "#999" }}>/</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
            {catName(categoryId)}
          </Typography>
        </>
      )}
      {subcategoryId !== "all" && subcategoryId && (
        <>
          <Typography variant="body2" sx={{ color: "#999" }}>/</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
            {subcatName(subcategoryId)}
          </Typography>
        </>
      )}
      {subsubcategoryId !== "all" && subsubcategoryId && (
        <>
          <Typography variant="body2" sx={{ color: "#999" }}>/</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
            {subsubcatName(subsubcategoryId)}
          </Typography>
        </>
      )}
    </Stack>
  );

  return (
    <Section title="Floors" subtitle={`Browse our range in ${catalog.serviceArea}.`}>
      <Container maxWidth="lg" disableGutters>
        <Box>
          {/* Breadcrumb */}
          {breadcrumb}

          {/* Product Count */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: "#555", 
              mb: 4,
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
                    sx={{ 
                      height: "100%",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      border: "1px solid #f0f0f0",
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
                        image={(item.images?.[0] ?? item.imageUrl) as string} 
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
