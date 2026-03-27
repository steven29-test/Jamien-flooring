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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { CatalogData, FloorCategory, FloorItem, FloorSubcategory } from "../types/catalog";
import { clearCatalogOverride, saveCatalogOverride } from "../utils/storage";
import { useMemo, useState } from "react";

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

export default function Admin({ baseCatalog, catalog, setCatalog }: Props) {
  const [copied, setCopied] = useState(false);

  const exportJson = useMemo(() => JSON.stringify(catalog, null, 2), [catalog]);

  function updateContact(partial: Partial<CatalogData["contact"]>) {
    setCatalog({ ...catalog, contact: { ...catalog.contact, ...partial } });
  }

  function updateHero(partial: Partial<CatalogData["hero"]>) {
    setCatalog({ ...catalog, hero: { ...catalog.hero, ...partial } });
  }

  function updateCategory(id: string, partial: Partial<FloorCategory>) {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    });
  }

  function addCategory() {
    const next: FloorCategory = { id: uid("cat"), name: "New Category", description: "", imageUrl: "", subcategories: [] };
    setCatalog({ ...catalog, categories: [next, ...catalog.categories] });
  }

  function deleteCategory(id: string) {
    setCatalog({
      ...catalog,
      categories: catalog.categories.filter((c) => c.id !== id),
      items: catalog.items.filter((i) => i.categoryId !== id),
    });
  }

  function addSubcategory(categoryId: string) {
    setCatalog({
      ...catalog,
      categories: catalog.categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: [
              ...(c.subcategories ?? []),
              { id: uid("subcat"), name: "New Subcategory", description: "" },
            ],
          };
        }
        return c;
      }),
    });
  }

  function updateSubcategory(categoryId: string, subcatId: string, partial: Partial<FloorSubcategory>) {
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
  }

  function deleteSubcategory(categoryId: string, subcatId: string) {
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
  }

  function updateItem(id: string, partial: Partial<FloorItem>) {
    setCatalog({
      ...catalog,
      items: catalog.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
    });
  }

  function addItemToSubcategory(categoryId: string, subcatId: string) {
    const next: FloorItem = {
      id: uid("item"),
      categoryId: categoryId,
      subcategoryId: subcatId,
      name: "New Floor Item",
      subtitle: "",
      priceHint: "",
      specs: [],
      imageUrl: "",
      featured: false,
    };
    setCatalog({ ...catalog, items: [next, ...catalog.items] });
  }

  function deleteItem(id: string) {
    setCatalog({ ...catalog, items: catalog.items.filter((i) => i.id !== id) });
  }

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

  async function uploadImage(file: File, onUrl: (url: string) => void) {
    const url = await fileToDataUrl(file);
    onUrl(url);
  }

  const itemsBySubcategory = useMemo(() => {
    const grouped: Record<string, FloorItem[]> = {};
    catalog.items.forEach((i) => {
      const key = `${i.categoryId}|${i.subcategoryId || ""}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(i);
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

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                Business & Contact
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Business name"
                    value={catalog.businessName}
                    onChange={(e) => setCatalog({ ...catalog, businessName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Service area"
                    value={catalog.serviceArea}
                    onChange={(e) => setCatalog({ ...catalog, serviceArea: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={catalog.contact.email ?? ""}
                    onChange={(e) => updateContact({ email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={catalog.contact.phone ?? ""}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={catalog.contact.address ?? ""}
                    onChange={(e) => updateContact({ address: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Categories & Subcategories
            </Typography>
            <Button startIcon={<AddIcon />} variant="contained" disableElevation onClick={addCategory} sx={{ fontWeight: 900 }}>
              Add category
            </Button>
          </Stack>

          {catalog.categories.map((category) => (
            <Card key={category.id} sx={{ borderRadius: 4, mb: 3 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{category.name}</Typography>
                    <IconButton color="error" onClick={() => deleteCategory(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="ID" value={category.id} onChange={(e) => updateCategory(category.id, { id: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField fullWidth label="Name" value={category.name} onChange={(e) => updateCategory(category.id, { name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Image URL" value={category.imageUrl ?? ""} onChange={(e) => updateCategory(category.id, { imageUrl: e.target.value })} placeholder="/images/xxx.jpg" />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 900 }}>Subcategories</Typography>
                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addSubcategory(category.id)} sx={{ fontWeight: 900 }}>
                      Add
                    </Button>
                  </Stack>

                  <Grid container spacing={1}>
                    {(category.subcategories ?? []).map((subcat) => (
                      <Grid item xs={12} key={subcat.id}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                            <Stack spacing={1} sx={{ flex: 1 }}>
                              <TextField size="small" fullWidth label="ID" value={subcat.id} onChange={(e) => updateSubcategory(category.id, subcat.id, { id: e.target.value })} />
                              <TextField size="small" fullWidth label="Name" value={subcat.name} onChange={(e) => updateSubcategory(category.id, subcat.id, { name: e.target.value })} />
                            </Stack>
                            <IconButton size="small" color="error" onClick={() => deleteSubcategory(category.id, subcat.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider />

                  <Typography sx={{ fontWeight: 900 }}>Products</Typography>

                  {(category.subcategories ?? []).map((subcat) => {
                    const key = `${category.id}|${subcat.id}`;
                    const items = itemsBySubcategory[key] || [];
                    return (
                      <Box key={subcat.id}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, pl: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{subcat.name}</Typography>
                          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => addItemToSubcategory(category.id, subcat.id)} sx={{ fontWeight: 900 }}>
                            Add product
                          </Button>
                        </Stack>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          {items.map((item) => (
                            <Grid item xs={12} key={item.id}>
                              <Card variant="outlined" sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                                    <IconButton size="small" color="error" onClick={() => deleteItem(item.id)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Stack>

                                  <Grid container spacing={1}>
                                    <Grid item xs={12} md={3}>
                                      <TextField size="small" fullWidth label="Name" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <TextField size="small" fullWidth label="Subtitle" value={item.subtitle ?? ""} onChange={(e) => updateItem(item.id, { subtitle: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <TextField size="small" fullWidth label="Price" value={item.priceHint ?? ""} onChange={(e) => updateItem(item.id, { priceHint: e.target.value })} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Button
                                        fullWidth
                                        size="small"
                                        variant={item.featured ? "contained" : "outlined"}
                                        onClick={() => updateItem(item.id, { featured: !item.featured })}
                                        sx={{ fontWeight: 900, height: 40 }}
                                      >
                                        {item.featured ? "Featured" : "Not featured"}
                                      </Button>
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        label="Images (one per line)"
                                        value={(item.images ?? []).join('\n')}
                                        onChange={(e) => updateItem(item.id, { images: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
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
                                            updateItem(item.id, { images: [...(item.images ?? []), ...urls] });
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
                                        onChange={(e) => updateItem(item.id, { specs: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
                                        multiline
                                        minRows={2}
                                      />
                                    </Grid>
                                  </Grid>
                                </Stack>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    );
                  })}
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
