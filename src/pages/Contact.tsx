import { useState } from "react";
import { Container, Typography, Grid, TextField, Button, Paper, Alert } from "@mui/material";
import catalog from "../data/catalog.json";
import { sendContact } from "../utils/contactSend";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSending(true);

    try {
      await sendContact({
        name,
        email,
        phone: phone || undefined,
        suburb: suburb || undefined,
        message,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSuburb("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 900 }}>
        Contact Jamien Flooring
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 820 }}>
        Tell us about your project and we'll reply with clear options and pricing. We service Sydney, especially the North Shore.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Thanks! Your message has been sent. We'll get back to you shortly.
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Suburb (optional)" value={suburb} onChange={(e) => setSuburb(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth required multiline minRows={5} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large" disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Contact details
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Email: <b>{catalog.contact.email}</b>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Service area: <b>{catalog.serviceArea}</b>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Prefer a quick chat? Use the chat button on the site and we'll respond as soon as possible.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
