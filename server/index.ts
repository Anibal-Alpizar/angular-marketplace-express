const express = require("express");
const cors = require("cors");
const { PORT } = require("./config.ts");
const indexRoutes = require("./routes/index.routes.ts");

const app = express();

app.use(
  cors({
    // angular
    origin: "http://localhost:4200",
  })
);

app.use(express.json());

// Routes
app.use(indexRoutes);

app.listen(PORT);

console.log(`Server is running on port ${PORT}`);
