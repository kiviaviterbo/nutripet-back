import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import sequelize from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
app.use(express.json()); 

app.use("/", router);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso!");

    // Sincroniza todas as models com o banco
    await sequelize.sync({ alter: true });
    console.log("Models sincronizadas com o banco.");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco:", error);
  }
};

startServer();


/* import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor NutriPet rodando na porta ${PORT}`)); */
