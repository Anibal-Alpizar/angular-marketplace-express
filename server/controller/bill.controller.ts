import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const getOrderDetailsForInvoice = async (
  req: Request,
  res: Response
) => {
  const orderId = parseInt(req.params.id);

  try {
    const order = await prisma.purchase.findUnique({
      where: { PurchaseId: orderId },
      include: {
        User: {
          select: {
            FullName: true,
            Address: true,
            Email: true,
          },
        },
        Address: {
          select: {
            ExactAddress: true,
            Province: true,
            Canton: true,
            District: true,
            PostalCode: true,
            Phone: true,
          },
        },
        PaymentMethod: {
          select: {
            PaymentType: true,
            AccountNumber: true,
          },
        },
        Product: {
          select: {
            ProductName: true,
            Price: true,
            Quantity: true,
            Description: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.User.Email,
      subject: "Factura de Compra",
      html: `
    <div style="font-family: Arial, sans-serif; margin: 20px;">
      <div style="background-color: #e6f7ff; padding: 20px; text-align: center;">
  <img src="https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-1/307024271_649474033217375_5626482126415593511_n.jpg?stp=dst-jpg_p200x200&_nc_cat=109&ccb=1-7&_nc_sid=c6021c&_nc_ohc=fRuTvMTr0c0AX-mB_Ln&_nc_ht=scontent.fsjo14-1.fna&oh=00_AfDMIJjLx7UKPoVxvQqnkE32P7d46FGYLucOWVFnvSVe3w&oe=64E910BB" alt="Logo de la Empresa" style="max-width: 150px;">
  <h2 style="margin: 10px 0; color: #555;">Factura de Compra</h2>
</div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; margin-top: 20px;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 10px; text-align: left; background-color: #e2e3e7;">Descripción</th>
      <th style="padding: 10px; text-align: center; background-color: #e2e3e7;">Cantidad</th>
      <th style="padding: 10px; text-align: center; background-color: #e2e3e7;">Precio Unitario</th>
      <th style="padding: 10px; text-align: center; background-color: #e2e3e7;">Subtotal</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px;">${order.Product.ProductName}</td>
      <td style="padding: 10px; text-align: center;">${order.Quantity}</td>
      <td style="padding: 10px; text-align: center;">$${order.Product.Price.toFixed(
        2
      )}</td>
      <td style="padding: 10px; text-align: center;">$${order.Subtotal.toFixed(
        2
      )}</td>
    </tr>
  </tbody>
  <tfoot style="background-color: #f2f2f2;">
    <tr>
      <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
      <td style="padding: 10px; text-align: center;">$${order.TotalAmount.toFixed(
        2
      )}</td>
    </tr>
  </tfoot>
</table>

       <!-- Información de la Factura -->
      <div style="background-color: #f7ebec; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="margin-bottom: 10px; color: #555;">Información de la Factura</h3>
        <p><strong>Número de Orden:</strong> ${order.PurchaseId}</p>
        <p><strong>Fecha de Compra:</strong> ${new Date(
          order.PurchaseDate
        ).toLocaleDateString()}</p>
        <p><strong>Estado de la Orden:</strong> ${order.PurchaseStatus}</p>
        <p><strong>Total Amount:</strong> $${order.TotalAmount.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> $${order.Subtotal.toFixed(2)}</p>
        <p><strong>Taxes:</strong> $${order.TaxAmount.toFixed(2)}</p>
      </div>
      
      <!-- Información del Cliente -->
      <div style="background-color: #f9eede; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="margin-bottom: 10px; color: #555;">Información del Cliente</h3>
        <p><strong>Nombre:</strong> ${order.User.FullName}</p>
        <p><strong>Dirección:</strong> ${order.User.Address}</p>
        <p><strong>Email:</strong> ${order.User.Email}</p>
      </div>
      
      <!-- Dirección de Entrega -->
      <div style="background-color: #e4f0d0; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="margin-bottom: 10px; color: #555;">Dirección de Entrega</h3>
        <p><strong>Dirección:</strong> ${order.Address.ExactAddress}, ${
        order.Address.District
      }, ${order.Address.Canton}, ${order.Address.Province}, ${
        order.Address.PostalCode
      }</p>
        <p><strong>Teléfono:</strong> ${order.Address.Phone}</p>
      </div>
      
      <!-- Método de Pago -->
      <div style="background-color: #f7d0cd; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="margin-bottom: 10px; color: #555;">Método de Pago</h3>
        <p><strong>Tipo de Pago:</strong> ${order.PaymentMethod.PaymentType}</p>
        <p><strong>Número de Cuenta:</strong> ${
          order.PaymentMethod.AccountNumber
        }</p>
      </div>
      
      <p style="margin-top: 20px; text-align: center; color: #555;">Gracias por su compra. 👋</p>   
        <p style="margin-top: 20px; text-align: center; color: #555;"><i>Este mensaje se ha generado automáticamente.</i></p>
        <p style="margin-top: 20px; text-align: center; color: #555;"><i>No conteste a este mensaje ya que no recibirá ninguna respuesta.</i></p>
    </div>
  `,
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo electrónico:", error);
      } else {
        console.log("Correo electrónico enviado:", info.response);
      }
    });

    // Respuesta JSON con los detalles de la orden
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener detalles de la orden para la factura",
    });
  }
};
