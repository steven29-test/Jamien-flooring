import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./theme/theme";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { isAdminAuthorized } from "./utils/adminGate";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Brands from "./pages/Brands";
import Deals from "./pages/Deals";
import NotFound from "./pages/NotFound";

import baseCatalogJson from "./data/catalog.json";
import type { CatalogData } from "./types/catalog";
import { loadCatalogOverride } from "./utils/storage";
import { sortCategories } from "./utils/categoryOrder";
import { useMemo, useState } from "react";
import catalog from "./data/catalog.json";

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";

export default function App() {
  const baseCatalog = baseCatalogJson as CatalogData;

  const initial = useMemo(() => {
    const override = loadCatalogOverride();
    return override ?? baseCatalog;
  }, [baseCatalog]);

  const [catalog, setCatalog] = useState<CatalogData>(initial);

  const normalizedCatalog = useMemo(() => {
    return {
      ...catalog,
      categories: sortCategories(catalog.categories ?? []),
    };
  }, [catalog]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar businessName={normalizedCatalog.businessName} logoUrl={normalizedCatalog.logoUrl} categories={normalizedCatalog.categories} />
        <Routes>
          <Route path="/" element={<Home catalog={normalizedCatalog} />} />
          <Route path="/catalog" element={<Catalog catalog={normalizedCatalog} />} />
          <Route path="/brands" element={<Brands catalog={normalizedCatalog} />} />
          <Route path="/deals" element={<Deals catalog={normalizedCatalog} />} />
          <Route path="/contact" element={<Contact />} />
          {ADMIN_ENABLED && (
            <Route
              path="/admin"
              element={<Admin baseCatalog={baseCatalog} catalog={catalog} setCatalog={setCatalog} />}
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer businessName={catalog.businessName} serviceArea={catalog.serviceArea} phone={catalog.contact.phone} email={catalog.contact.email} address={catalog.contact.address} />
        <ChatWidget phone={catalog.contact.phone} email={catalog.contact.email} whatsappNumberE164={import.meta.env.VITE_WHATSAPP_E164} />
      </BrowserRouter>
    </ThemeProvider>
  );
}