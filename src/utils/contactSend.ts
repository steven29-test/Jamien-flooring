import emailjs from "@emailjs/browser";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  message: string;
};

function requiredEnv(key: string): string {
  const v = (import.meta.env as any)[key];
  if (!v || String(v).trim() === "") {
    throw new Error(
      `Missing ${key}. Please set it in .env.local (and GitHub Actions variables for production).`
    );
  }
  return String(v).trim();
}

function nowLocalString(): string {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
  } catch {
    return new Date().toLocaleString();
  }
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const serviceId = requiredEnv("VITE_EMAILJS_SERVICE_ID");
  // Your template ID is fixed to match the EmailJS template you created.
  const templateId =
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim() ||
    "template_mlklq0g";
  const publicKey = requiredEnv("VITE_EMAILJS_PUBLIC_KEY");

  // These fields MUST match your EmailJS template variables:
  // {{title}} {{name}} {{email}} {{time}} {{message}}
  const composedMessage = [
    payload.message,
    "",
    payload.phone ? `Phone: ${payload.phone}` : "",
    payload.suburb ? `Suburb: ${payload.suburb}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const templateParams = {
    title: "Jamien Flooring Website Enquiry",
    name: payload.name,
    email: payload.email,
    time: nowLocalString(),
    message: composedMessage,
  };

  await emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
