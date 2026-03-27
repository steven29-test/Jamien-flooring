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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { CatalogData, FloorCategory, FloorItem } from "../types/catalog";
import { clearCatalogOverride, saveCatalogOverride } from "../utils/storage";
import { useMemo, useState } from "react";
import { assetUrl } from "../utils/assetUrl";

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
    const next: FloorCategory = { id: uid("cat"), name: "New Category", description: "", imageUrl: "" };
    setCatalog({ ...catalog, categories: [next, ...catalog.categories] });
  }

  function deleteCategory(id: string) {
    setCatalog({
      ...catalog,
      categories: catalog.categories.filter((c) => c.id !== id),
      items: catalog.items.filter((i) => i.categoryId !== id),
    });
  }

  function updateItem(id: string, partial: Partial<FloorItem>) {
    setCatalog({
      ...catalog,
      items: catalog.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
    });
  }

  function addItemToCategory(categoryId: string) {
    const next: FloorItem = {
      id: uid("item"),
      categoryId: categoryId,
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

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, FloorItem[]> = {};
    catalog.categories.forEach((c) => {
      grouped[c.id] = catalog.items.filter((i) => i.categoryId === c.id);
    });
    return grouped;
  }, [catalog]);

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Admin
          </Typography>

          <Alert severity="warning">
            This editor saves to <b>browser storage</b>. For real updates:
            copy the export JSON into <b>src/data/catalog.json</b> and push to GitHub.
          </Alert>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" disableElevation onClick={saveToBrowser} sx={{ fontWeight: 900 }}>
              Save to this browser
            </Button>
            <Button variant="outlined" onClick={resetToFile} sx={{ fontWeight: 900 }}>
              Reset to file version
            </Button>
            <Button variant="outlined" onClick={copyExport} sx={{ fontWeight: 900 }}>
              {copied ? "Copied!" : "Copy export JSON"}
            </Button>
          </Stack>

          <Divider />

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                Business & contact
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
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={catalog.contact.phone ?? ""}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={catalog.contact.address ?? ""}
                    onChange={(e) => updateContact({ address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Hours"
                    value={catalog.contact.hours ?? ""}
                    onChange={(e) => updateContact({ hours: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                Hero
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Headline"
                    value={catalog.hero.headline}
                    onChange={(e) => updateHero({ headline: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subheadline"
                    value={catalog.hero.subheadline}
                    onChange={(e) => updateHero({ subheadline: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Hero image URL"
                    value={catalog.hero.heroImageUrl ?? ""}
                    onChange={(e) => updateHero({ heroImageUrl: e.target.value })}
                    placeholder="/images/hero.jpg or https://..."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth component="label" variant="outlined" sx={{ fontWeight: 900, height: 56 }}>
                    Upload (local preview)
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        await uploadImage(f, (url) => updateHero({ heroImageUrl: url }));
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Categories
            </Typography>
            <Button startIcon={<AddIcon />} variant="contained" disableElevation onClick={addCategory} sx={{ fontWeight: 900 }}>
              Add category
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {catalog.categories.map((c) => (
              <Grid item xs={12} md={6} key={c.id}>
                <Card sx={{ borderRadius: 4 }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontWeight: 900 }}>{c.name}</Typography>
                        <IconButton color="error" onClick={() => deleteCategory(c.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>

                      <TextField fullWidth label="ID" value={c.id} onChange={(e) => updateCategory(c.id, { id: e.target.value })} />
                      <TextField fullWidth label="Name" value={c.name} onChange={(e) => updateCategory(c.id, { name: e.target.value })} />
                      <TextField fullWidth label="Description" value={c.description ?? ""} onChange={(e) => updateCategory(c.id, { description: e.target.value })} />
                      <TextField fullWidth label="Image URL" value={c.imageUrl ?? ""} onChange={(e) => updateCategory(c.id, { imageUrl: e.target.value })} placeholder="/images/xxx.jpg or https://..." />

                      <Button component="label" variant="outlined" sx={{ fontWeight: 900 }}>
                        Upload image (local preview)
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            await uploadImage(f, (url) => updateCategory(c.id, { imageUrl: url }));
                          }}
                        />
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider />

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Products by Category
          </Typography>

          {catalog.categories.map((category) => (
            <Box key={category.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {category.name}
                </Typography>
                <Button startIcon={<AddIcon />} variant="contained" disableElevation onClick={() => addItemToCategory(category.id)} sx={{ fontWeight: 900 }}>
                  Add product
                </Button>
              </Stack>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {(itemsByCategory[category.id] || []).map((i) => (
                  <Grid item xs={12} key={i.id}>
                    <Card sx={{ borderRadius: 4 }}>
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontWeight: 900 }}>{i.name}</Typography>
                            <IconButton color="error" onClick={() => deleteItem(i.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField fullWidth label="Name" value={i.name} onChange={(e) => updateItem(i.id, { name: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField fullWidth label="Subtitle" value={i.subtitle ?? ""} onChange={(e) => updateItem(i.id, { subtitle: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField fullWidth label="Price hint" value={i.priceHint ?? ""} onChange={(e) => updateItem(i.id, { priceHint: e.target.value })} />
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <TextField
                                fullWidth
                                label="Images (one per line)"
                                value={(i.images ?? []).join('\n')}
                                onChange={(e) =>
                                  updateItem(i.id, {
                                    images: e.target.value
                                      .split('\n')
                                      .map((x) => x.trim())
                                      .filter(Boolean),
                                  })
                                }
                                placeholder={"/images/hybrid-1.jpg\nhttps://...\n(data url...)"}
                                multiline
                                minRows={3}
                                helperText="First image becomes the thumbnail."
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Button
                                fullWidth
                                component="label"
                                variant="outlined"
                                sx={{ fontWeight: 900, height: 56 }}
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
                                    updateItem(i.id, { images: [...(i.images ?? []), ...urls] });
                                  }}
                                />
                              </Button>
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Specs (one per line)"
                                value={(i.specs ?? []).join('\n')}
                                onChange={(e) => updateItem(i.id, { specs: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
                                multiline
                                minRows={3}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                variant={i.featured ? "contained" : "outlined"}
                                disableElevation
                                onClick={() => updateItem(i.id, { featured: !i.featured })}
                                sx={{ fontWeight: 900 }}
                              >
                                {i.featured ? "Featured: ON" : "Featured: OFF"}
                              </Button>
                            </Grid>
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />
            </Box>
          ))}

          <Divider />

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Export JSON (paste into src/data/catalog.json)
          </Typography>
          <TextField fullWidth value={exportJson} multiline minRows={10} />
        </Stack>
      </Box>
    </Box>
  );
}
