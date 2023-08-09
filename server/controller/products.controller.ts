import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { categories } from "../prisma/seeds/categories";
import { users } from "../prisma/seeds/users";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";

const prisma = new PrismaClient();


export const getProductsByVendor = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        UserId: userId,
      },
      include: {
        Products: true,
      },
    });

    if (!user || !user.Products || user.Products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified vendor" });
    }

    const products = user.Products;

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

    const productsWithFullPhotoURL = products.map((product) => {
      if (product.Photos) {
        return {
          ...product,
          Photos: product.Photos.map((photo) => ({
            ...photo,
            PhotoURL: `http://localhost:3000/uploads/${photo.PhotoURL}`,
          })),
        };
      }
      return product;
    });

    res.json(productsWithFullPhotoURL);
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
            QuestionId: true,
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

    const productsWithFullPhotoURL = product.map((product) => {
      if (product.Photos) {
        return {
          ...product,
          Photos: product.Photos.map((photo) => ({
            ...photo,
            PhotoURL: `http://localhost:3000/uploads/${photo.PhotoURL}`,
          })),
        };
      }
      return product;
    });

    res.json(productsWithFullPhotoURL);
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
 

    //Cargamos la imagen que nos envian
    sampleFile = req.files.sampleFile;
    sampleFile2 = req.files.sampleFile2;

    let fileName = "";
    let fileName2 = "";

     //Se crea una constante, donde se van a guardar las img con su nombre
     const path = `./uploads`;

    //Verificamos si el tipo de img que nos estan enviando es el formato correcto de png y jpg
    if (sampleFile && (sampleFile.mimetype === "image/png" || sampleFile.mimetype === "image/jpg")) {
     
      //Creamos la extención
      const fileExtension = sampleFile.mimetype.split("/")[1];
      //El nombre con una variable aleatoria y la extención
      fileName = `${uuidv4()}.${fileExtension}`;
      //Se asegura que la carpeta de la variable path exista, donde se van a guardar las imagenes
      await fs.ensureDir(path);
      //Despues enviamos la img y la guardamos
      await sampleFile.mv(`${path}/${fileName}`, function (err: any) {
        if (err)
          return res
            .status(404)
            .json({ message: "No products found for the specified user role" });
      });
    }

    if (sampleFile2 && (sampleFile2.mimetype === "image/png" || sampleFile2.mimetype === "image/jpg")) { 
      //Creamos la extensión para la segunda imagen
      const fileExtension2 = sampleFile2.mimetype.split("/")[1];
      //El nombre con una variable aleatoria y la extensión para la segunda imagen
      fileName2 = `${uuidv4()}.${fileExtension2}`;

   

      //Después enviamos la segunda imagen y la guardamos
      await sampleFile2.mv(`${path}/${fileName2}`, function (err: any) {
        if (err)
          return res
            .status(404)
            .json({ message: "No products found for the specified user role" });
      });
    }

    //Agregar las variables, donde se encuentran la img en el array de Photos de la DB
    products.Photos = [fileName, fileName2];

    // Parseo de los valores de Price, Rating y Quantity a números
    products.Price = parseFloat(products.Price);
    products.Rating = parseInt(products.Rating);
    products.Quantity = parseInt(products.Quantity);
    products.CategoryId = parseInt(products.CategoryId);
    products.UserId = parseInt(products.UserId);
    //Creamos el producto
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
  //Metemos el id que nos mandan del producto en esta variable
  let productId = parseInt(req.params.id);

  try {
    // Buscamos el producto en la base de datos
    const existingProduct = await prisma.product.findUnique({
      where: { ProductId: productId },
      include: { Photos: true },
    });

    //Validamos que exista ese producto
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    /*Se declaran estas variables para cargar las imagenes en ella
      vamos a tener 4 imagenes, así solo se puede modificar una imagen individualmente
    */
    let sampleFile: any;
    let sampleFile2: any;

    //Esta variable se declara para meter las imagenes nuevas en ella
    let updatedPhotos = [...existingProduct.Photos];

    //Cargamos las imagenes que nos envian, en las variables declaradas anteriormente
    sampleFile = req.files?.sampleFile;
    sampleFile2 = req.files?.sampleFile2;

    const path = `./uploads`;
    //Verificamos si el tipo de img que nos estan enviando es el formato correcto de png y jpg
    if (sampleFile && (sampleFile.mimetype === "image/png" || sampleFile.mimetype === "image/jpg")) {
      //Se crea una constante, donde se van a guardar las img con su nombre

      //Creamos la extención
      const fileExtension = sampleFile.mimetype.split("/")[1];
      //se crea esta variable para cargar la img en ella con un nombre aleatorio de la librerio uuid y se le agrega la extención
      const fileName = `${uuidv4()}.${fileExtension}`;

       //Se verifica que la carpeta fue creada
       await fs.ensureDir(path);

      //Despues enviamos la img y la guardamos
      await sampleFile.mv(`${path}/${fileName}`, function (err: any) {
        if (err)
          return res
            .status(404)
            .json({ message: "No products found for the specified user role" });
      });

      updatedPhotos[0].PhotoURL = fileName;

    }

    if (sampleFile2 && (sampleFile2.mimetype === "image/png" || sampleFile2.mimetype === "image/jpg")) { 

      //Creamos la extensión para la segunda imagen
      const fileExtension2 = sampleFile2.mimetype.split("/")[1];
      //El nombre con una variable aleatoria y la extensión para la segunda imagen
      const fileName2 = `${uuidv4()}.${fileExtension2}`;

      //Se verifica que la carpeta fue creada
      await fs.ensureDir(path);

        //Después enviamos la segunda imagen y la guardamos
        await sampleFile2.mv(`${path}/${fileName2}`, function (err: any) {
          if (err)
            return res
              .status(404)
              .json({ message: "No products found for the specified user role" });
        });

       // Actualizamos las rutas de las fotos existentes
       updatedPhotos[1].PhotoURL = fileName2;
    }
          
      // Actualizamos las rutas de las fotos existentes
      req.body.Photos = updatedPhotos;

    // Eliminamos las imágenes antiguas que no están siendo utilizadas
    const oldPhotosURLs = existingProduct.Photos.map((photo) => photo.PhotoURL);
    const newPhotosURLs = updatedPhotos.map((photo) => photo.PhotoURL);

    const imagesToDelete = oldPhotosURLs.filter(
      (url) => !newPhotosURLs.includes(url)
    );

    for (const imageUrl of imagesToDelete) {
      const imagePath = `./uploads/${imageUrl}`;
      try {
        await fs.unlink(imagePath); // Elimina la imagen del directorio uploads
      } catch (error) {
        console.error(`Error al eliminar la imagen ${imageUrl}:`, error);
      }
    }

    // Actualizamos el producto en la base de datos con los nuevos valores
    const updatedProduct = await prisma.product.update({
      where: { ProductId: productId },
      data: {
        ProductName: req.body.ProductName || existingProduct.ProductName,
        Description: req.body.Description || existingProduct.Description,
        Price: parseFloat(req.body.Price) || existingProduct.Price,
        Status: req.body.Status || existingProduct.Status,
        Rating: parseInt(req.body.Rating) || existingProduct.Rating,
        Quantity: parseInt(req.body.Quantity) || existingProduct.Quantity,
        Photos: {
          update: updatedPhotos.map((photo: any) => ({
            where: { PhotoId: photo.PhotoId },
            data: { PhotoURL: photo.PhotoURL },
          })),
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  res.send(`Server response: delete product`);
};
