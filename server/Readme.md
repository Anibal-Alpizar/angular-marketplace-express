1- A la hora de crear el producto me tiene que enviar los siguientes datos
*Nombre del producto
*Descripción 
*Precio
*Estado ( Nuevo, Usado-Como nuevo, Usado-Buen estado y Usado-Aceptable)
*Cantidad
*Categoria, por ID
*Usuario, por Id
*Photos por separadas 2

Pero lo envia de la siguiente manera:
Key                     Value
ProductName             Hola Prueba Imagen  ..
Description             Hola                ..
Price                   45.5                ..
Quantity                10                  .. 
Status                  Nuevo               ..
CategoryId              1
UserId                  2
sampleFile              Selecciona una imagen
sampleFile2             Selecciona una imagen


La ruta es la siguiente: /createProducts




crear pregunta
{
  "QuestionText": "Is this product available in different colors?",
  "Product": {
    "ProductId": 1
  },
  "User": {
    "UserId": 3
  }
}



