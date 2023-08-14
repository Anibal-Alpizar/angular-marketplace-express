import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Funtion about list purchaseItem for users

export const getPurchaseItemByUser = async (req: Request, res: Response) => {
  let id = 3;

  try {
    const purchaseItems = await prisma.purchaseItem.findMany({
      where: {
        Purchase: {
          User: {
            Roles: {
              some: {
                UserId: id,
              },
            },
          },
        },
      },
      include: {
        Product: {
          select: {
            ProductId: true,
            ProductName: true,
            Price: true,
            Description: true,
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
        Purchase: {
          select: {
            PurchaseId: true,
            UserId: true,
            PaymentMethodId: true,
            AddressId: true,
            TotalAmount: true,
            TaxAmount: true,
            PurchaseDate: true,
            PurchaseStatus: true,
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
      },
    });

    if (purchaseItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    // Agrupar los productos por la orden de compra (Purchase)
    const purchaseOrders: { [key: number]: any } = purchaseItems.reduce(
      (acc: { [key: number]: any }, purchaseItem) => {
        const purchaseId = purchaseItem.Purchase.PurchaseId;
        if (!acc[purchaseId]) {
          acc[purchaseId] = {
            ...(purchaseItem.Purchase as any),
            PurchaseItems: [],
          };
        }
        acc[purchaseId].PurchaseItems.push(purchaseItem);
        return acc;
      },
      {}
    );

    res.json(Object.values(purchaseOrders));
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//Funtion about list purchaseItem for vendor
export const getPurchaseItemByVendor = async (req: Request, res: Response) => {
  const vendorId = 2;

  try {
    const orders = await prisma.purchase.findMany({
      where: {
        PurchaseItems: {
          some: {
            Product: {
              User: {
                UserId: vendorId,
              },
            },
          },
        },
      },
      include: {
        PurchaseItems: {
          include: {
            Product: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });

    const filteredOrders = orders.map((order) => {
      const filteredPurchaseItems = order.PurchaseItems.filter(
        (item) => item.Product.User.UserId === vendorId
      );
      return { ...order, PurchaseItems: filteredPurchaseItems };
    });

    if (filteredOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the specified vendor" });
    }

    res.json(filteredOrders);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const detailsPurchaseItemByCustomer = async (
  req: Request,
  res: Response
) => {
  let purchaseId = parseInt(req.params.purchaseId); // Assuming you pass the purchaseId in the request parameter


  try {
    const purchaseItems = await prisma.purchaseItem.findMany({
      where: {
        PurchaseId: purchaseId,
      },
      include: {
        Product: {
          select: {
            ProductId: true,
            ProductName: true,
            Price: true,
            Description: true,
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
        Purchase: {
          select: {
            PurchaseId: true,
            UserId: true,
            PaymentMethodId: true,
            AddressId: true,
            TotalAmount: true,
            TaxAmount: true,
            PurchaseDate: true,
            PurchaseStatus: true,
            User: {
              select: {
                UserId: true,
                FullName: true,
                Email: true,
                Addresses: true,
                PaymentMethod: {
                  select: {
                    PaymentType: true,
                    Provider: true,
                    AccountNumber: true,
                    ExpirationMonth: true,
                  },
                },
              },
            },
            Address: {
              select: {
                Province: true,
                Canton: true,
                District: true,
                ExactAddress: true,
                PostalCode: true,
              },
            },
          },
        },
      },
    });

    if (purchaseItems.length === 0) {
      return res
        .status(404)
        .json({
          message: "No purchase items found for the specified purchase",
        });
    }

    res.json(purchaseItems);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};




export const detailsPurchaseItemsByPurchase = async (
  req: Request,
  res: Response
) => {
  let purchaseId = parseInt(req.params.purchaseId);

  try {
    const purchaseItems = await prisma.purchaseItem.findMany({
      where: {
        Purchase: {
          PurchaseId: purchaseId,
        },
      },
      include: {
        Product: {
          // Incluye los detalles del producto
        },
        Purchase: {
          // Incluye los detalles de la compra
        },
      },
    });

    if (purchaseItems.length === 0) {
      return res
        .status(404)
        .json({
          message: "No purchase items found for the specified purchase",
        });
    }

    res.json(purchaseItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while fetching purchase items.",
      // error: error.message,
    });
  }
};
