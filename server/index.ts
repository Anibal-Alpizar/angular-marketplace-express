import express from "express";
import cors from "cors";
import { PORT } from "./config";
import indexRoutes from "./routes/index.routes";
import productsRoutes from "./routes/products.routes";
import purchaseItemRoutes from "./routes/purchaseItem.routes";
import questions from "./routes/questions.routes";
import answer from "./routes/answer.routes";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.routes";
import categoriesRoutes from "./routes/category.routes";
import paymenthRoute from "./routes/payment.routes";
import fileUpload from "express-fileupload";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import addressRouter from "./routes/address.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200", // angular
  })
);

app.use(express.json());
app.use(fileUpload());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use(errorHandler);

// Routes
app.use(indexRoutes);
app.use(productsRoutes);
app.use(purchaseItemRoutes);
app.use(userRoutes);
app.use(questions);
app.use(answer);
app.use(categoriesRoutes);
app.use(paymenthRoute);
app.use(orderRoutes);
app.use(addressRouter);

app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
