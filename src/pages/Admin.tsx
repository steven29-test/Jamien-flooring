import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { CatalogData, FloorCategory, FloorItem, FloorSubcategory, FloorSubSubcategory } from "../types/catalog";
import { clearCatalogOverride, saveCatalogOverride } from "../utils/storage";
import { useMemo, useState, useCallback, memo } from "react";

type Props = {
  baseCatalog: CatalogData;
  catalog: CatalogData;
  setCatalog: (c: CatalogData) => void;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ProductCard = memo(({ item, onUpdate, onDelete }: { item: FloorItem; onUpdate: (partial: Partial<FloorItem>) => void; onDelete: () => void }) => (
  <Card variant="outlined" sx={{ p: 1.5, mb: 1 }}>
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{item.name}</Typography>
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Name" value={item.name} onChange={(e) => onUpdate({ name: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Subtitle" value={item.subtitle ?? ""} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Price" value={item.priceHint ?? ""} onChange={(e) => onUpdate({ priceHint: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            size="small"
            variant={item.featured ? "contained" : "outlined"}
            onClick={() => onUpdate({ featured: !item.featured })}
            sx={{ fontWeight: 900, height: 40 }}
          >
            {item.featured ? "Featured" : "Not featured"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Description"
            value={item.description ?? ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Product description shown on detail page"
            multiline
            minRows={2}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            size="small"
            fullWidth
            label="Images (one per line)"
            value={(item.images ?? []).join('\n')}
            onChange={(e) => onUpdate({ images: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
            placeholder="/images/xxx.jpg"
            multiline
            minRows={2}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            size="small"
            component="label"
            variant="outlined"
            sx={{ fontWeight: 900, height: 40 }}
          >
            Upload images
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length === 0) return;
                const urls = await Promise.all(files.map((f) => fileToDataUrl(f)));
                onUpdate({ images: [...(item.images ?? []), ...urls] });
              }}
            />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Specs (one per line)"
            value={(item.specs ?? []).join('\n')}
            onChange={(e) => onUpdate({ specs: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
            multiline
            minRows={2}
          />
        </Grid>
      </Grid>
    </Stack>
  </Card>
));

ProductCard.displayName = "ProductCard";

export default function Admin({ baseCatalog, catalog, setCatalog }: Props) {
  const [copied, setCopied] = useState(false);

  const exportJson = useMemo(() => JSON.stringify(catalog, null, 2), [catalog]);

  const updateCategory = useCallback((id: string, partial: Partial<FloorCategory>) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    });
  }, [catalog, setCatalog]);

  const addCategory = useCallback(() => {
    const next: FloorCategory = { id: uid("cat"), name: "New Category", description: "", imageUrl: "", subcategories: [] };
    setCatalog({ ...catalog, categories: [next, ...catalog.categories] });
  }, [catalog, setCatalog]);

  const deleteCategory = useCallback((id: string) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.filter((c) => c.id !== id),
      items: catalog.items.filter((i) => i.categoryId !== id),
    });
  }, [catalog, setCatalog]);

  const addSubcategory = useCallback((categoryId: string) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: [
              ...(c.subcategories ?? []),
              { id: uid("subcat"), name: "New Type", description: "", subsubcategories: [] },
            ],
          };
        }
        return c;
      }),
    });
  }, [catalog, setCatalog]);

  const updateSubcategory = useCallback((categoryId: string, subcatId: string, partial: Partial<FloorSubcategory>) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories ?? []).map((s) =>
              s.id === subcatId ? { ...s, ...partial } : s
            ),
          };
        }
        return c;
      }),
    });
  }, [catalog, setCatalog]);

  const deleteSubcategory = useCallback((categoryId: string, subcatId: string) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories ?? []).filter((s) => s.id !== subcatId),
          };
        }
        return c;
      }),
      items: catalog.items.filter((i) => !(i.categoryId === categoryId && i.subcategoryId === subcatId)),
    });
  }, [catalog, setCatalog]);

  const addSubsubcategory = useCallback((categoryId: string, subcatId: string) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories ?? []).map((s) => {
              if (s.id === subcatId) {
                return {
                  ...s,
                  subsubcategories: [
                    ...(s.subsubcategories ?? []),
                    { id: uid("subsubcat"), name: "New Brand", description: "" },
                  ],
                };
              }
              return s;
            }),
          };
        }
        return c;
      }),
    });
  }, [catalog, setCatalog]);

  const updateSubsubcategory = useCallback((categoryId: string, subcatId: string, subsubcatId: string, partial: Partial<FloorSubSubcategory>) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories ?? []).map((s) => {
              if (s.id === subcatId) {
                return {
                  ...s,
                  subsubcategories: (s.subsubcategories ?? []).map((ss) =>
                    ss.id === subsubcatId ? { ...ss, ...partial } : ss
                  ),
                };
              }
              return s;
            }),
          };
        }
        return c;
      }),
    });
  }, [catalog, setCatalog]);

  const deleteSubsubcategory = useCallback((categoryId: string, subcatId: string, subsubcatId: string) => {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories ?? []).map((s) => {
              if (s.id === subcatId) {
                return {
                  ...s,
                  subsubcategories: (s.subsubcategories ?? []).filter((ss) => ss.id !== subsubcatId),
                };
              }
              return s;
            }),
          };
        }
        return c;
      }),
      items: catalog.items.filter((i) => !(i.categoryId === categoryId && i.subcategoryId === subcatId && i.subsubcategoryId === subsubcatId)),
    });
  }, [catalog, setCatalog]);

  const updateItem = useCallback((id: string, partial: Partial<FloorItem>) => {
    setCatalog({
      ...catalog,
      items: catalog.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
    });
  }, [catalog, setCatalog]);

  const addItemToCategory = useCallback((categoryId: string) => {
    const next: FloorItem = {
      id: uid("item"),
      categoryId: categoryId,
      name: "New Product",
      subtitle: "",
      description: "",
      priceHint: "",
      specs: [],
      imageUrl: "",
      featured: false,
    };
    setCatalog({ ...catalog, items: [next, ...catalog.items] });
  }, [catalog, setCatalog]);

  const addItemToType = useCallback((categoryId: string, subcatId: string) => {
    const next: FloorItem = {
      id: uid("item"),
      categoryId: categoryId,
      subcategoryId: subcatId,
      name: "New Product",
      subtitle: "",
      description: "",
      priceHint: "",
      specs: [],
      imageUrl: "",
      featured: false,
    };
    setCatalog({ ...catalog, items: [next, ...catalog.items] });
  }, [catalog, setCatalog]);

  const addItemToVariant = useCallback((categoryId: string, subcatId: string, subsubcatId: string) => {
    const next: FloorItem = {
      id: uid("item"),
      categoryId: categoryId,
      subcategoryId: subcatId,
      subsubcategoryId: subsubcatId,
      name: "New Product",
      subtitle: "",
      description: "",
      priceHint: "",
      specs: [],
      imageUrl: "",
      featured: false,
    };
    setCatalog({ ...catalog, items: [next, ...catalog.items] });
  }, [catalog, setCatalog]);

  const deleteItem = useCallback((id: string) => {
    setCatalog({ ...catalog, items: catalog.items.filter((i) => i.id !== id) });
  }, [catalog, setCatalog]);

  async function copyExport() {
    await navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function saveToBrowser() {
    saveCatalogOverride(catalog);
  }

  function resetToFile() {
    clearCatalogOverride();
    setCatalog(baseCatalog);
  }

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, FloorItem[]> = {};
    catalog.items.forEach((i) => {
      if (!i.subcategoryId && !i.subsubcategoryId) {
        if (!grouped[i.categoryId]) grouped[i.categoryId] = [];
        grouped[i.categoryId].push(i);
      }
    });
    return grouped;
  }, [catalog.items]);

  const itemsByType = useMemo(() => {
    const grouped: Record<string, FloorItem[]> = {};
    catalog.items.forEach((i) => {
      if (i.subcategoryId && !i.subsubcategoryId) {
        const key = `${i.categoryId}|${i.subcategoryId}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(i);
      }
    });
    return grouped;
  }, [catalog.items]);

  const itemsByBrand = useMemo(() => {
    const grouped: Record<string, FloorItem[]> = {};
    catalog.items.forEach((i) => {
      if (i.subsubcategoryId) {
        const key = `${i.categoryId}|${i.subcategoryId}|${i.subsubcategoryId}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(i);
      }
    });
    return grouped;
  }, [catalog.items]);

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Admin
          </Typography>

          <Alert severity="warning">
            Copy export JSON into <b>src/data/catalog.json</b> and push to GitHub.
          </Alert>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" disableElevation onClick={saveToBrowser} sx={{ fontWeight: 900 }}>
              Save to browser
            </Button>
            <Button variant="outlined" onClick={resetToFile} sx={{ fontWeight: 900 }}>
              Reset
            </Button>
            <Button variant="outlined" onClick={copyExport} sx={{ fontWeight: 900 }}>
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              📁 Categories
            </Typography>
            <Button startIcon={<AddIcon />} variant="contained" disableElevation onClick={addCategory} sx={{ fontWeight: 900 }}>
              Add category
            </Button>
          </Stack>

          {catalog.categories.map((category) => (
            <Card key={category.id} sx={{ borderRadius: 4, mb: 3, backgroundColor: "#E3F2FD", borderLeft: "6px solid #2196F3" }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>🔵 {category.name}</Typography>
                    <IconButton color="error" onClick={() => deleteCategory(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="ID" value={category.id} onChange={(e) => updateCategory(category.id, { id: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Name" value={category.name} onChange={(e) => updateCategory(category.id, { name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Image URL" value={category.imageUrl ?? ""} onChange={(e) => updateCategory(category.id, { imageUrl: e.target.value })} placeholder="/images/xxx.jpg" />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 900, fontSize: 16 }}>Products (Category Level)</Typography>
                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addItemToCategory(category.id)} sx={{ fontWeight: 900 }}>
                      Add product
                    </Button>
                  </Stack>

                  {(itemsByCategory[category.id] || []).map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onUpdate={(partial) => updateItem(item.id, partial)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}

                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 900 }}>📂 Types</Typography>
                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addSubcategory(category.id)} sx={{ fontWeight: 900 }}>
                      Add type
                    </Button>
                  </Stack>

                  {(category.subcategories ?? []).map((type) => (
                    <Card key={type.id} variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: "#E8F5E9", borderLeft: "6px solid #4CAF50" }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 900, fontSize: 16 }}>🟢 {type.name}</Typography>
                          <IconButton size="small" color="error" onClick={() => deleteSubcategory(category.id, type.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>

                        <Grid container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <TextField size="small" fullWidth label="Type ID" value={type.id} onChange={(e) => updateSubcategory(category.id, type.id, { id: e.target.value })} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField size="small" fullWidth label="Type Name" value={type.name} onChange={(e) => updateSubcategory(category.id, type.id, { name: e.target.value })} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Products (Type Level)</Typography>
                          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addItemToType(category.id, type.id)} sx={{ fontWeight: 900 }}>
                            Add product
                          </Button>
                        </Stack>

                        {(itemsByType[`${category.id}|${type.id}`] || []).map((item) => (
                          <ProductCard
                            key={item.id}
                            item={item}
                            onUpdate={(partial) => updateItem(item.id, partial)}
                            onDelete={() => deleteItem(item.id)}
                          />
                        ))}

                        <Divider />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 700 }}>📌 Brands</Typography>
                          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addSubsubcategory(category.id, type.id)} sx={{ fontWeight: 900 }}>
                            Add brand
                          </Button>
                        </Stack>

                        {(type.subsubcategories ?? []).map((variant) => (
                          <Card key={variant.id} variant="outlined" sx={{ p: 1.5, mb: 1.5, backgroundColor: "#FFF3E0", borderLeft: "6px solid #FF9800" }}>
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>🟠 {variant.name}</Typography>
                                <IconButton size="small" color="error" onClick={() => deleteSubsubcategory(category.id, type.id, variant.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>

                              <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Brand ID"
                                    value={variant.id}
                                    onChange={(e) => updateSubsubcategory(category.id, type.id, variant.id, { id: e.target.value })}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Brand Name"
                                    value={variant.name}
                                    onChange={(e) => updateSubsubcategory(category.id, type.id, variant.id, { name: e.target.value })}
                                  />
                                </Grid>
                              </Grid>

                              <Stack direction="row" justifyContent="flex-end">
                                <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addItemToVariant(category.id, type.id, variant.id)} sx={{ fontWeight: 900 }}>
                                  Add product
                                </Button>
                              </Stack>

                              {(itemsByBrand[`${category.id}|${type.id}|${variant.id}`] || []).map((item) => (
                                <ProductCard
                                  key={item.id}
                                  item={item}
                                  onUpdate={(partial) => updateItem(item.id, partial)}
                                  onDelete={() => deleteItem(item.id)}
                                />
                              ))}
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Divider />

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Export JSON
          </Typography>
          <TextField fullWidth value={exportJson} multiline minRows={12} sx={{ fontFamily: "monospace", fontSize: 12 }} />
        </Stack>
      </Box>
    </Box>
  );
}
