import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const confirmarOrder = async (req: Request, res: Response) => {
//   try {
//     const { userId, paymentMethodId, addressId, purchaseItems } = req.body;

//     const purchaseItemsData = purchaseItems.map((item: any) => ({
//       Product: { connect: { ProductId: item.productId } },
//       Quantity: item.quantity,
//       Subtotal: item.subtotal,
//       PurchaseStatus: "Pending",
//     }));

//     // Calcular el TotalAmount sumando los subtotales de los PurchaseItems y los precios de los productos
//     const totalAmountWithoutTax = purchaseItems.reduce(
//       (acc: number, item: any) => acc + item.subtotal + item.product.Price,
//       0
//     );

//     // Calcular el impuesto (tax) del 13% del TotalAmount
//     const taxAmount = totalAmountWithoutTax * 0.13;

//     // Calcular el TotalAmount sumando los subtotales, el Price de los productos y el impuesto
//     const totalAmount = totalAmountWithoutTax + taxAmount;

//     const orderData: any = {
//       User: {
//         connect: {
//           UserId: userId,
//         },
//       },
//       PaymentMethod: {
//         connect: {
//           PaymentMethodId: paymentMethodId,
//         },
//       },
//       Address: {
//         connect: {
//           AddressId: addressId,
//         },
//       },
//       TotalAmount: totalAmount,
//       TaxAmount: taxAmount,
//       PurchaseStatus: "Pending",
//       PurchaseItems: {
//         create: purchaseItemsData,
//       },
//       PurchaseDate: new Date(),
//     };

//     const createdOrder = await prisma.purchase.create({
//       data: orderData,
//       include: {
//         User: true,
//         Address: true,
//         PaymentMethod: true,
//         PurchaseItems: {
//           include: {
//             Product: true,
//           },
//         },
//       },
//     });

//     res.status(201).json(createdOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating order" });
//   }
// };

export const createOrder = async (req: Request, res: Response) => {
  const purchase = req.body;

  try {
    // Obtener información detallada del producto
    const product = await prisma.product.findUnique({
      where: { ProductId: purchase.productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const subtotal = purchase.Quantity * product.Price;
    const taxAmount = subtotal * 0.13;
    const totalAmount = subtotal + taxAmount;

    const newPurchase = await prisma.purchase.create({
      data: {
        Quantity: parseInt(purchase.Quantity),
        TotalAmount: totalAmount,
        TaxAmount: taxAmount,
        PurchaseDate: new Date(),
        PurchaseStatus: "En progreso",
        Subtotal: subtotal,
        User: { connect: { UserId: purchase.userId } },
        PaymentMethod: {
          connect: { PaymentMethodId: purchase.PaymentMethodId },
        },
        Address: { connect: { AddressId: parseInt(purchase.AddressId) } },
        Product: { connect: { ProductId: purchase.productId } },
      },
    });

    if (newPurchase === null) {
      return res.status(404).json({
        message:
          "No se encontraron productos para el rol de usuario especificado",
      });
    }

    res.json(newPurchase);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getPurchaseByCustumer = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { UserId: userId },
      include: {
        Purchase: {
          orderBy: {
            PurchaseStatus: "desc",
          },
        },
        Addresses: true,
        PaymentMethod: true,
        Products: true,
      },
    });

    if (!user || !user.Purchase || user.Purchase.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron compras para el usuario" });
    }

    const purchase = user.Purchase;

    res.json(purchase);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const details = async (req: Request, res: Response) => {
  const purchaseId = parseInt(req.params.id);

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { PurchaseId: purchaseId },
      include: {
        Address: true,
        PaymentMethod: true,
        Product: {
          select: {
            ProductId: true,
            ProductName: true,
            Price: true,
            Description: true,
            Quantity: true,
            User: {
              select: {
                UserId: true,
                FullName: true,
                Email: true,
                Addresses: true,
              },
            },
          },
        },
        User: true,
      },
    });

    const purchaseArray = [purchase]; // Convert the object to an array

    res.json(purchaseArray);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const markOrderAsCompleted = async (req: Request, res: Response) => {
  const purchaseId = parseInt(req.params.id);

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { PurchaseId: purchaseId },
      include: {
        Product: true, // Include product details
      },
    });

    if (!purchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    const updatedPurchase = await prisma.purchase.update({
      where: { PurchaseId: purchaseId },
      data: { PurchaseStatus: "Completada" },
    });

    // Update product quantity
    const productId = purchase.Product.ProductId;
    const newQuantity = purchase.Product.Quantity - purchase.Quantity;

    await prisma.product.update({
      where: { ProductId: productId },
      data: { Quantity: newQuantity },
    });

    res.json(updatedPurchase);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al marcar la orden como completada" });
  }
};

export const updateProductQuantityByPurchaseId = async (
  req: Request,
  res: Response
) => {
  const purchaseId = parseInt(req.params.id);
  const newQuantity = parseInt(req.body.newQuantity);

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { PurchaseId: purchaseId },
      include: {
        Product: true,
      },
    });

    if (!purchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    if (!purchase.Product) {
      return res
        .status(400)
        .json({ message: "El producto asociado no fue encontrado" });
    }

    const availableQuantity = purchase.Product.Quantity;

    if (newQuantity > availableQuantity) {
      return res.status(400).json({
        message:
          "La cantidad solicitada excede la cantidad disponible del producto",
      });
    }

    const updatedPurchase = await prisma.purchase.update({
      where: { PurchaseId: purchaseId },
      data: { Quantity: newQuantity },
    });

    res.json(updatedPurchase);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la cantidad de la compra" });
  }
};

export const getCompletedPurchases = async (req: Request, res: Response) => {
  try {
    const completedPurchases = await prisma.purchase.findMany({
      where: {
        PurchaseStatus: "Completada", // Filter by 'Completada' status
      },
      include: {
        Product: {
          select: {
            ProductName: true,
          },
        },
        User: {
          select: {
            FullName: true,
          },
        },
      },
    });

    res.json(completedPurchases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
