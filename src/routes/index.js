import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import loginRoutes from "./loginRoutes.js";
import tabelaRoutes from "./tabelaRoutes.js";
import petRoutes from "./petRoutes.js";
import assinaturaRoutes from "./assinaturaRoutes.js";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/login", loginRoutes);
router.use("/tabelas", tabelaRoutes);
router.use("/pets", petRoutes);
router.use("/assinaturas", assinaturaRoutes);

export default router;


/* import express from "express";
import exampleController from "../controllers/exampleController.js";

const router = express.Router();
router.get("/", exampleController.hello);

export default router; */
