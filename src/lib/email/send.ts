import nodemailer from "nodemailer";
import { getEmailConfig, isEmailConfigured } from "./config";

export type SendMailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendMail(params: SendMailParams): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("Email: envio desabilitado ou SMTP não configurado");
    return;
  }

  const config = getEmailConfig();
  const auth =
    config.user && config.pass
      ? { user: config.user, pass: config.pass }
      : undefined;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth,
  });

  await transporter.sendMail({
    from: config.fromName ? `"${config.fromName}" <${config.from}>` : config.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}
