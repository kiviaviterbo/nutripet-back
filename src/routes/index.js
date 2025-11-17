import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import loginRoutes from "./loginRoutes.js";
import tabelaRoutes from "./tabelaRoutes.js";
import petRoutes from "./petRoutes.js";
import assinaturaRoutes from "./assinaturaRoutes.js";
import consultaRoutes from "./consultaRoutes.js"

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/login", loginRoutes);
router.use("/tabelas", tabelaRoutes);
router.use("/pets", petRoutes);
router.use("/assinaturas", assinaturaRoutes);
router.use("/consultas", consultaRoutes)

export default router;
