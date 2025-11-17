import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import sequelize from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use("/", router);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso!");

    await sequelize.sync({ alter: false });
    console.log("Models sincronizadas com sucesso!");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
};

startServer();
