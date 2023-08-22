import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { param } from "express-validator";

const prisma = new PrismaClient();

export const getSalesPerDay = async (req: Request, res: Response) => {
  try {
    const result = await prisma.purchase.findMany({
      where: {
        PurchaseDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      select: {
        PurchaseDate: true,
      },
    });

    const cantidadDeCompras = result.length.toString();

    res.json({ cantidadDeCompras });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching sales data." });
  }
};

export const getTopProductsByMonth = async (req: Request, res: Response) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  try {
    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT 
        p.ProductId, 
        pr.ProductName,
        SUM(p.Quantity) AS TotalQuantity
      FROM 
        Purchase p
      JOIN
        Product pr ON p.ProductId = pr.ProductId
      WHERE 
        MONTH(p.PurchaseDate) = ${currentMonth} AND YEAR(p.PurchaseDate) = ${currentYear}
      GROUP BY 
        p.ProductId, pr.ProductName
      ORDER BY 
        TotalQuantity DESC
      LIMIT 
        5;
    `
    );

    const formattedResult = result.map((item: any) => ({
      ProductId: item.ProductId,
      ProductName: item.ProductName,
      TotalQuantity: parseInt(item.TotalQuantity),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

export const getTopRatedSellers = async (req: Request, res: Response) => {
  try {
    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT 
        u.UserId, 
        u.FullName,
        AVG(e.Rating) AS AverageRating
      FROM 
        User u
      LEFT JOIN
        Evaluation e ON u.UserId = e.UserId
      GROUP BY 
        u.UserId, u.FullName
      HAVING 
        COUNT(e.Rating) > 0
      ORDER BY 
        AverageRating DESC
      LIMIT 
        5;
    `
    );

    const formattedResult = result.map((item: any) => ({
      UserId: item.UserId,
      FullName: item.FullName,
      AverageRating: parseFloat(item.AverageRating),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

export const getWorstRatedSellers = async (req: Request, res: Response) => {
  try {
    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT 
        u.UserId, 
        u.FullName,
        AVG(e.Rating) AS AverageRating
      FROM 
        User u
      LEFT JOIN
        Evaluation e ON u.UserId = e.UserId
      GROUP BY 
        u.UserId, u.FullName
      HAVING 
        COUNT(e.Rating) > 0
      ORDER BY 
        AverageRating ASC
      LIMIT 
        3;
    `
    );

    const formattedResult = result.map((item: any) => ({
      UserId: item.UserId,
      FullName: item.FullName,
      AverageRating: parseFloat(item.AverageRating),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

export const calculateAverageRating = async (req: Request, res: Response) => {
  try {
    const userRatings = await prisma.evaluation.findMany({
      select: {
        UserId: true,
        Rating: true,
      },
    });

    const userRatingsMap = new Map<number, number[]>();
    userRatings.forEach((rating) => {
      const userId = rating.UserId;
      if (!userRatingsMap.has(userId)) {
        userRatingsMap.set(userId, []);
      }
      userRatingsMap.get(userId)?.push(rating.Rating);
    });

    const userAverageRatings = Array.from(userRatingsMap.entries()).map(
      ([userId, ratings]) => {
        const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = totalRatings / ratings.length || 0;
        const roundedAverage = Math.round(averageRating * 100) / 100; // Round to 2 decimal places
        return { userId, averageRating: roundedAverage };
      }
    );

    for (const { userId, averageRating } of userAverageRatings) {
      await prisma.user.update({
        where: { UserId: userId },
        data: { SellerRating: averageRating },
      });
    }

    res.json(userAverageRatings);
  } catch (error) {
    console.error("Error calculating and updating user ratings:", error);
    res.status(500).json({ message: "An error occurred while updating data." });
  } finally {
    await prisma.$disconnect();
  }
};


export const getBestSellingProductsBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = parseInt(req.params.id);

    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT
        p.ProductId,
        p.ProductName,
        COALESCE(SUM(pi.Quantity), 0) AS TotalSold
      FROM
        Product p
      LEFT JOIN
        Purchase pi ON p.ProductId = pi.ProductId
      WHERE
        p.UserId = ${sellerId}
      GROUP BY
        p.ProductId, p.ProductName
      ORDER BY
        TotalSold DESC
      LIMIT
        1;
      `
    );

    const formattedResult = result.map((item: any) => ({
      ProductId: item.ProductId,
      ProductName: item.ProductName,
      TotalSold: parseInt(item.TotalSold),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};

export const getTopCustomerBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = parseInt(req.params.id);

    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT
        u.UserId,
        u.FullName,
        COALESCE(SUM(p.Quantity), 0) AS TotalPurchases
      FROM
        User u
      LEFT JOIN
        Purchase p ON u.UserId = p.UserId
      LEFT JOIN
        Product pr ON p.ProductId = pr.ProductId
      WHERE
        pr.UserId = ${sellerId}
      GROUP BY
        u.UserId, u.FullName
      ORDER BY
        TotalPurchases DESC
      LIMIT
        1;
      `
    );

    const formattedResult = result.map((item: any) => ({
      UserId: item.UserId,
      FullName: item.FullName,
      TotalPurchases: parseInt(item.TotalPurchases),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};


export const getEvaluationCountsByRating = async (req: Request, res: Response) => {
  try {
    const sellerId = parseInt(req.params.id);

    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT
        e.Rating,
        COUNT(e.EvaluationId) AS Count
      FROM
        Evaluation e
      INNER JOIN
        Purchase p ON e.PurchaseId = p.PurchaseId
      INNER JOIN
        Product pr ON p.ProductId = pr.ProductId
      WHERE
        pr.UserId = ${sellerId}
      GROUP BY
        e.Rating
      ORDER BY
        e.Rating DESC;
      `
    );

    const formattedResult = result.map((item: any) => ({
      Rating: item.Rating,
      Count: parseInt(item.Count),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};




