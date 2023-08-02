// emailService.ts

import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "riosurporpista@gmail.com",
    pass: "vfotibpjmvldwars",
  },
});

export function sendVerificationEmail(
  to: string,
  verificationCode: string,
  selectedData: any // Datos del usuario que deseas mostrar en el correo
): Promise<void> {
  const message = `
    <p>Gracias por registrarte en nuestro sitio. A continuación, te mostramos los datos que seleccionaste:</p>
    <ul>
      <li>Nombre completo: ${selectedData.FullName}</li>
      <li>Identificación: ${selectedData.Identification}</li>
      <li>Número de teléfono: ${selectedData.PhoneNumber}</li>
      <li>Email: ${selectedData.Email}</li>
      <li>Dirección: ${selectedData.Address}</li>
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
