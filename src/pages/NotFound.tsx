import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Section from "../components/Section";

export default function NotFound() {
  return (
    <Section>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4" sx={{ fontWeight: 900 }}>Page not found</Typography>
        <Button component={RouterLink} to={import.meta.env.BASE_URL} variant="contained" disableElevation sx={{ fontWeight: 900 }}>
          Back home
        </Button>
      </Stack>
    </Section>
  );
}
