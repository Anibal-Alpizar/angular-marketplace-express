import express from "express";
import cors from "cors";
import { PORT } from "./config";
import indexRoutes from "./routes/index.routes";
import productsRoutes from "./routes/products.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200", // angular
  })
);

app.use(express.json());

// Routes
app.use(indexRoutes);
app.use(productsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
