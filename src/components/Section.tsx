import { Container, Box, Typography } from "@mui/material";
import React from "react";

type Props = { title?: string; subtitle?: string; children: React.ReactNode };

export default function Section({ title, subtitle, children }: Props) {
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        {(title || subtitle) && (
          <Box sx={{ mb: 3 }}>
            {title && (
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </Container>
    </Box>
  );
}
