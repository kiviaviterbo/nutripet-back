import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import sequelize from "./config/database.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/", routes);

sequelize.sync()
  .then(() => console.log("✅ Banco sincronizado com sucesso"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));

export default app;
