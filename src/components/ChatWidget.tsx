import {
  Box,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useMemo, useState } from "react";

type Props = {
  phone?: string;
  email?: string;
  whatsappNumberE164?: string; // e.g. 61412345678 (no +)
};

function digitsOnly(s: string) {
  return s.replace(/[^\d]/g, "");
}

export default function ChatWidget({ phone, email, whatsappNumberE164 }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const tel = useMemo(() => (phone ? `tel:${digitsOnly(phone)}` : ""), [phone]);
  const sms = useMemo(() => (phone ? `sms:${digitsOnly(phone)}` : ""), [phone]);
  const wa = useMemo(
    () => (whatsappNumberE164 ? `https://wa.me/${digitsOnly(whatsappNumberE164)}` : ""),
    [whatsappNumberE164]
  );
  const mail = useMemo(() => {
    if (!email) return "";
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Jamien Flooring enquiry")}`;
  }, [email]);

  return (
    <Box
      sx={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: (t) => t.zIndex.modal + 1,
      }}
    >
      <Tooltip title="Text us">
        <Fab
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Text us"
        >
          <ChatIcon />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 220 } }}
      >
        <MenuItem
          disabled={!phone}
          component="a"
          href={tel || undefined}
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <PhoneInTalkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Call us" secondary={phone || "Add phone"} />
        </MenuItem>

        <MenuItem
          disabled={!phone}
          component="a"
          href={sms || undefined}
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <SmsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="SMS / Text" secondary={phone || "Add phone"} />
        </MenuItem>

        <MenuItem
          disabled={!whatsappNumberE164}
          component="a"
          href={wa || undefined}
          target="_blank"
          rel="noreferrer"
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="WhatsApp"
            secondary={whatsappNumberE164 ? "Chat on WhatsApp" : "Add WhatsApp"}
          />
        </MenuItem>

        <MenuItem
          disabled={!email}
          component="a"
          href={mail || undefined}
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={email || "Add email"} />
        </MenuItem>
      </Menu>
    </Box>
  );
}
