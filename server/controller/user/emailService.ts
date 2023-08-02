// emailService.ts

import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export function sendVerificationEmail(
  to: string,
  verificationCode: string,
  selectedData: any
): Promise<void> {
  const message = `
    <p>Gracias por registrarte en nuestro sitio. A continuación, te mostramos los datos que seleccionaste:</p>
    <ul>
      <li>Nombre completo: ${selectedData.FullName}</li>
      <li>Identificación: ${selectedData.Identification}</li>
      <li>Número de teléfono: ${selectedData.PhoneNumber}</li>
      <li>Email: ${selectedData.Email}</li>
      <li>Dirección: ${selectedData.Address}</li>
      <li>Código de verificación: ${verificationCode}</li>
    </ul>
  `;

  const mailOptions = {
    from: "riosurporpista@gmail.com",
    to: to,
    subject: "Confirm your email address",
    html: message,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
