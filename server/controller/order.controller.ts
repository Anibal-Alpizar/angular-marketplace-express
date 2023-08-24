import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Purchase } from '@prisma/client';


const prisma = new PrismaClient();


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

export const getProductsPurchasedByVendor = async (req: Request, res: Response) => {
  const vendorId = parseInt(req.params.id);

  try {
    const vendor = await prisma.user.findUnique({
      where: { UserId: vendorId },
      include: {
        Products: {
          include: {
            Purchase: {
              include: {
                User: true,
                Address: true,
                PaymentMethod: true,
              },
            },
          },
        },
      },
    });

    if (!vendor || !vendor.Products || vendor.Products.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos comprados al proveedor" });
    }

    const purchasedProducts: Purchase[] = vendor.Products.reduce((acc:any, product) => {
      if (product.Purchase && product.Purchase.length > 0) {
        acc.push(...product.Purchase);
      }
      return acc;
    }, []);

    res.json(purchasedProducts);
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
