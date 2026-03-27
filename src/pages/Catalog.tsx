import {
  Box, Card, CardContent, CardMedia, Chip, Divider, FormControl, InputLabel, MenuItem, Select,
  Stack, TextField, Typography, Grid,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import type { CatalogData } from "../types/catalog";
import { sortCategories } from "../utils/categoryOrder";
import { assetUrl } from "../utils/assetUrl";

type Props = { catalog: CatalogData };

export default function Catalog({ catalog }: Props) {
  const [params, setParams] = useSearchParams();
  const urlCat = params.get("category") ?? params.get("cat") ?? "all";
  const urlSubcat = params.get("subcategory") ?? "all";
  const urlSubsubcat = params.get("subsubcategory") ?? "all";

  const [categoryId, setCategoryId] = useState<string>(urlCat);
  const [subcategoryId, setSubcategoryId] = useState<string>(urlSubcat);
  const [subsubcategoryId, setSubsubcategoryId] = useState<string>(urlSubsubcat);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setCategoryId(urlCat);
    setSubcategoryId(urlSubcat);
    setSubsubcategoryId(urlSubsubcat);
  }, [urlCat, urlSubcat, urlSubsubcat]);

  const categories = useMemo(
    () => [{ id: "all", name: "All categories" }, ...sortCategories(catalog.categories)],
    [catalog.categories]
  );

  const subcategories = useMemo(() => {
    if (categoryId === "all") return [];
    const cat = catalog.categories.find((c) => c.id === categoryId);
    return cat?.subcategories ?? [];
  }, [catalog.categories, categoryId]);

  const subsubcategories = useMemo(() => {
    if (subcategoryId === "all" || !subcategoryId) return [];
    const cat = catalog.categories.find((c) => c.id === categoryId);
    const subcat = cat?.subcategories?.find((s) => s.id === subcategoryId);
    return subcat?.subsubcategories ?? [];
  }, [catalog.categories, categoryId, subcategoryId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.items
      .filter((i) => (categoryId === "all" ? true : i.categoryId === categoryId))
      .filter((i) => {
        if (subcategoryId === "all" || !subcategoryId) return true;
        return i.subcategoryId === subcategoryId;
      })
      .filter((i) => {
        if (subsubcategoryId === "all" || !subsubcategoryId) return true;
        return i.subsubcategoryId === subsubcategoryId;
      })
      .filter((i) => {
        if (!q) return true;
        return (
          i.name.toLowerCase().includes(q) ||
          (i.subtitle ?? "").toLowerCase().includes(q) ||
          (i.specs ?? []).join(" ").toLowerCase().includes(q)
        );
      });
  }, [catalog.items, categoryId, subcategoryId, subsubcategoryId, query]);

  function onCategoryChange(next: string) {
    setCategoryId(next);
    setSubcategoryId("all");
    setSubsubcategoryId("all");
    const nextParams = new URLSearchParams(params);
    nextParams.delete("cat");
    nextParams.delete("subcategory");
    nextParams.delete("subsubcategory");
    if (next === "all") nextParams.delete("category");
    else nextParams.set("category", next);
    setParams(nextParams, { replace: true });
  }

  function onSubcategoryChange(next: string) {
    setSubcategoryId(next);
    setSubsubcategoryId("all");
    const nextParams = new URLSearchParams(params);
    nextParams.delete("subsubcategory");
    if (next === "all") nextParams.delete("subcategory");
    else nextParams.set("subcategory", next);
    setParams(nextParams, { replace: true });
  }

  function onSubsubcategoryChange(next: string) {
    setSubsubcategoryId(next);
    const nextParams = new URLSearchParams(params);
    if (next === "all") nextParams.delete("subsubcategory");
    else nextParams.set("subsubcategory", next);
    setParams(nextParams, { replace: true });
  }

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

  return (
    <Section title="Floors" subtitle={`Browse our range in ${catalog.serviceArea}.`}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="cat">Category</InputLabel>
            <Select labelId="cat" label="Category" value={categoryId} onChange={(e) => onCategoryChange(e.target.value)}>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {subcategories.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="subcat">Type</InputLabel>
              <Select labelId="subcat" label="Type" value={subcategoryId} onChange={(e) => onSubcategoryChange(e.target.value)}>
                <MenuItem value="all">All types</MenuItem>
                {subcategories.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {subsubcategories.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="subsubcat">Variant</InputLabel>
              <Select labelId="subsubcat" label="Variant" value={subsubcategoryId} onChange={(e) => onSubsubcategoryChange(e.target.value)}>
                <MenuItem value="all">All variants</MenuItem>
                {subsubcategories.map((ss) => (
                  <MenuItem key={ss.id} value={ss.id}>{ss.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField fullWidth label="Search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. oak, water resistant..." />
        </Stack>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Showing <b>{filtered.length}</b> item(s){categoryId !== "all" ? <> in <b>{catName(categoryId)}</b>{subcategoryId !== "all" && subcategoryId ? <> → <b>{subcatName(subcategoryId)}</b>{subsubcategoryId !== "all" && subsubcategoryId ? <> → <b>{subsubcatName(subsubcategoryId)}</b></> : null}</> : null}</> : null}
        </Typography>

        <Grid container spacing={2}>
          {filtered.map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i.id}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                {(i.images?.[0] ?? i.imageUrl) ? <CardMedia component="img" height="180" image={(i.images?.[0] ?? i.imageUrl) as string} alt={i.name} /> : <Box sx={{ height: 180, bgcolor: "grey.100" }} />}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>{i.name}</Typography>
                  {i.subtitle && <Typography variant="body2" color="text.secondary">{i.subtitle}</Typography>}

                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                    <Chip size="small" label={catName(i.categoryId)} />
                    {i.subcategoryId && <Chip size="small" label={subcatName(i.subcategoryId)} variant="outlined" />}
                    {i.subsubcategoryId && <Chip size="small" label={subsubcatName(i.subsubcategoryId)} variant="outlined" />}
                    {i.priceHint && <Chip size="small" label={i.priceHint} />}
                    {i.featured && <Chip size="small" label="Featured" />}
                  </Stack>

                  {(i.specs?.length ?? 0) > 0 && (
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {i.specs!.slice(0, 3).map((s, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary">• {s}</Typography>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
