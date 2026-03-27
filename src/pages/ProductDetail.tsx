import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Stack, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import type { CatalogData, FloorItem } from "../types/catalog";
import { assetUrl } from "../utils/assetUrl";

type Props = { catalog: CatalogData };

export default function ProductDetail({ catalog }: Props) {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const [params] = useSearchParams();

  const item = catalog.items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <Section title="Product Not Found">
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            We couldn't find this product.
          </Typography>
          <Button onClick={() => navigate("/catalog")} sx={{ mt: 2 }}>
            Back to Catalog
          </Button>
        </Box>
      </Section>
    );
  }

  const categoryName = catalog.categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId;
  const typeName = catalog.categories
    .find((c) => c.id === item.categoryId)
    ?.subcategories?.find((s) => s.id === item.subcategoryId)?.name ?? "";
  const brandName = catalog.categories
    .find((c) => c.id === item.categoryId)
    ?.subcategories?.find((s) => s.id === item.subcategoryId)
    ?.subsubcategories?.find((ss) => ss.id === item.subsubcategoryId)?.name ?? "";

  const imageUrl = (item.images?.[0] ?? item.imageUrl) as string;

  return (
    <Section>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => navigate(`/catalog?${params.toString()}`)}
          sx={{ textTransform: "none" }}
        >
          ← Back to Catalog
        </Button>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Image */}
        <Box sx={{ flex: 1, minHeight: 300 }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              image={assetUrl(imageUrl)}
              alt={item.name}
              sx={{ borderRadius: 4, width: "100%", height: "auto" }}
            />
          ) : (
            <Box sx={{ height: 300, bgcolor: "grey.100", borderRadius: 4 }} />
          )}
        </Box>

        {/* Details */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                {categoryName}
                {typeName && ` > ${typeName}`}
                {brandName && ` > ${brandName}`}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
                {item.name}
              </Typography>
              {item.subtitle && (
                <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.subtitle}
                </Typography>
              )}
            </Box>

            {/* Description */}
            {item.description && (
              <Box>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Box>
            )}

            <Divider />

            {/* Details Row */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {item.priceHint && <Chip label={item.priceHint} />}
              {item.brand && <Chip label={`Brand: ${item.brand}`} />}
              {item.featured && <Chip label="Featured" color="primary" />}
              {item.isDeal && <Chip label="Deal" color="success" />}
            </Stack>

            {/* Specs */}
            {(item.specs?.length ?? 0) > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Features
                </Typography>
                <Stack spacing={0.5}>
                  {item.specs!.map((spec, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary">
                      • {spec}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider />

            {/* CTA */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Ready to learn more or get a quote?
              </Typography>
              <Button
                href="/#contact"
                variant="contained"
                size="large"
                sx={{ textTransform: "none" }}
              >
                Get Free Quote
              </Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Section>
  );
}
