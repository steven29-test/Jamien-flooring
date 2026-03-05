import emailjs from "@emailjs/browser";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  message: string;
  attachments?: File[];
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
  const publicKey = requiredEnv("VITE_EMAILJS_PUBLIC_KEY");
  const templateId =
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim() ||
    "template_mlklq0g";

  const composedMessage = [
    payload.message,
    "",
    payload.phone ? `Phone: ${payload.phone}` : "",
    payload.suburb ? `Suburb: ${payload.suburb}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const templateParams: any = {
    title: "Jamien Flooring Website Enquiry",
    name: payload.name,
    email: payload.email,
    time: nowLocalString(),
    message: composedMessage,
  };

  // Handle file attachments if provided
  if (payload.attachments && payload.attachments.length > 0) {
    const attachmentPromises = payload.attachments.map(async (file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    const attachmentBase64s = await Promise.all(attachmentPromises);
    const attachmentNames = payload.attachments.map((f) => f.name).join(", ");
    
    // Add attachments to template params (EmailJS Pro feature)
    attachmentBase64s.forEach((base64, index) => {
      templateParams[`attachment_${index + 1}`] = base64;
    });
    
    templateParams.attachmentNames = attachmentNames;
    templateParams.message = composedMessage + `\n\nAttachments: ${attachmentNames}`;
  }

  await emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
