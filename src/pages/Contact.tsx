import { useState } from "react";
import { Container, Typography, Grid, TextField, Button, Paper, Alert, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import catalog from "../data/catalog.json";
import { sendContact } from "../utils/contactSend";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB per file
      const validFiles = newFiles.filter((file) => {
        if (file.size > maxSize) {
          setError(`File "${file.name}" is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });
      setAttachments([...attachments, ...validFiles]);
    }
  }

  function removeAttachment(index: number) {
    setAttachments(attachments.filter((_, i) => i !== index));
  }

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
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSuburb("");
      setMessage("");
      setAttachments([]);
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

                {/* File Upload */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "#1976d2",
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="file-input"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    />
                    <label htmlFor="file-input" style={{ cursor: "pointer", display: "block" }}>
                      <CloudUploadIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Click to upload or drag files here
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: Images, PDF, Word, Excel, TXT (Max 5MB each)
                      </Typography>
                    </label>
                  </Box>
                </Grid>

                {/* Display attached files */}
                {attachments.length > 0 && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Attached Files ({attachments.length}):
                      </Typography>
                      {attachments.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            mb: 1,
                            bgcolor: "rgba(25, 118, 210, 0.08)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">{file.name}</Typography>
                          <Button
                            size="small"
                            onClick={() => removeAttachment(index)}
                            sx={{ color: "error.main" }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                )}

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
              Contact Details
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <b>Address:</b> {catalog.contact.address}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Call us:</b> {catalog.contact.callUs}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>SMS/TXT:</b> {catalog.contact.smsTxt}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>WhatsApp:</b> {catalog.contact.whatsapp}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <b>Email:</b> {catalog.contact.email}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 3 }}>
              Prefer a quick chat? Use the chat button on the site and we'll respond as soon as possible.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
