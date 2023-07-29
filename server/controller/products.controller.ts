import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { categories } from "../prisma/seeds/categories";
import { users } from "../prisma/seeds/users";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';

const prisma = new PrismaClient();

//Funtion about get all products to only vendor
export const getProductsByVendor = async (req: Request, res: Response) => {
  let roleId = 2; // ID del Role específico para el vendedor

  try {
    const users = await prisma.user.findMany({
      where: {
        Roles: {
          some: {
            RoleId: roleId,
          },
        },
      },
      include: {
        Products: true,
      },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    const products = users.flatMap((user) => user.Products);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//Funtion about get all products to anything user
export const getProductByUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        Products: {
          include: {
            Photos: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found or the users do not have any products",
      });
    }

    const products = users.flatMap((user) => user.Products);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//Funtion about details to products
export const detailsProducts = async (req: Request, res: Response) => {
  let ProductIdId = parseInt(req.params.id); // ID del producto

  try {
    const product = await prisma.product.findMany({
      where: { ProductId: ProductIdId },
      include: {
        Category: true,
        User: {
          select: {
            UserId: true,
            FullName: true,
            Identification: true,
            PhoneNumber: true,
            Email: true,
            Password: true,
            IsActive: true,
            Address: true,
            Answers: true,
          },
        },
        Questions: {
          select: {
            QuestionText: true,
            User: {
              select: {
                FullName: true,
                Email: true,
              },
            },
            Answers: true,
          },
        },
        Photos: true,
      },
    });

    if (product.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};


//Funtion about to create a new product
export const createProduct = async (req: any, res: Response) => {
  const products = req.body;
  try {
    //Se declara esta variable para cargar la imagen en ella
    let sampleFile: any;
    let sampleFile2: any;
    //Se valida que se recibio correctamenta la imagen
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    //Cargamos la imagen que nos envian
    sampleFile = req.files.sampleFile;
    sampleFile2 = req.files.sampleFile2;

    let fileName = "";
    let fileName2 = "";

    //Verificamos si el tipo de img que nos estan enviando es el formato correcto de png y jpg
    if (sampleFile.mimetype === 'image/png' || sampleFile.mimetype === 'image/jpg') {
      //Se crea una constante, donde se van a guardar las img con su nombre
      const path = `./uploads`;
      //Creamos la extención 
      const fileExtension = sampleFile.mimetype.split('/')[1];
      //El nombre con una variable aleatoria y la extención
      fileName = `${uuidv4()}.${fileExtension}`;
      //Se asegura que la carpeta de la variable path exista, donde se van a guardar las imagenes

      //Creamos la extensión para la segunda imagen
      const fileExtension2 = sampleFile2.mimetype.split('/')[1];
      //El nombre con una variable aleatoria y la extensión para la segunda imagen
      fileName2 = `${uuidv4()}.${fileExtension2}`;

      await fs.ensureDir(path);
      //Despues enviamos la img y la guardamos
      await sampleFile.mv(`${path}/${fileName}`, function (err: any) {
        if (err)
          return res
            .status(404)
            .json({ message: "No products found for the specified user role" });

        //  res.send('File uploaded!');
      });

      //Después enviamos la segunda imagen y la guardamos
      await sampleFile2.mv(`${path}/${fileName2}`, function (err: any) {
        if (err)
          return res
            .status(404)
            .json({ message: "No products found for the specified user role" });
      });
    } else {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }


    products.Photos = [fileName, fileName2];

    // Parseo de los valores de Price, Rating y Quantity a números
    products.Price = parseFloat(products.Price);
    products.Rating = parseInt(products.Rating);
    products.Quantity = parseInt(products.Quantity);
    products.CategoryId = parseInt(products.CategoryId);
    products.UserId = parseInt(products.UserId);

    const newProduct = await prisma.product.create({
      data: {
        ProductName: products.ProductName,
        Description: products.Description,
        Price: products.Price,
        Status: products.Status,
        Rating: 3,
        Quantity: products.Quantity,
        Category: { connect: { CategoryId: products.CategoryId } },
        User: { connect: { UserId: products.UserId } },
        Photos: {
          create: products.Photos.map((photoUrl: string) => ({
            PhotoURL: photoUrl,
          })),
        },
      },

    });


    if (newProduct === null) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    res.json(newProduct);

  } catch (error) {
    console.log(error);
    res.json(error);
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  let product = req.body;
  let productId = parseInt(req.params.id);
  
  try {

  
     //Se valida que se recibio correctamenta la imagen
     if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

  

    //This function is to bring an old product
    const oldProduct = await prisma.product.findUnique({
      where: { ProductId: productId },
      include: {
        Category: { select: { CategoryId: true } },
        User: { select: { UserId: true }, }
      },
    });

    const newProduct = await prisma.product.update({
      where: { ProductId: productId },
      data: {
        ProductId: product.ProductId,
        ProductName: product.ProductName,
        Description: product.Description,
        Price: product.Price,
        Status: product.Status,
        Rating: product.Rating,
        Quantity: product.Quantity,
        Category: {
          connect: product.Category,
        },
        User: { connect: product.User, },
      },
    })





  } catch (error) {
    console.log(error);
    res.json(error);
  }

};

export const deleteProduct = (req: Request, res: Response) => {
  res.send(`Server response: delete product`);
};
