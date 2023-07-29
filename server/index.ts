import express from "express";
import cors from "cors";
import { PORT } from "./config";
import indexRoutes from "./routes/index.routes";
import productsRoutes from "./routes/products.routes";
import purchaseItemRoutes from "./routes/purchaseItem.routes";
import questions from './routes/questions.routes';
import answer from './routes/answer.routes';
import userRoutes from "./routes/user.routes";
import fileUpload from 'express-fileupload'

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200", // angular
  })
);

app.use(express.json());
app.use(fileUpload());
// Routes
app.use(indexRoutes);
app.use(productsRoutes);
app.use(purchaseItemRoutes);
app.use(userRoutes);
app.use(questions);
app.use(answer);

app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
