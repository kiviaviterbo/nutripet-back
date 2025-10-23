import { Router } from "express";
import tabelaController from "../controllers/tabelaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Protegido: só usuários logados podem criar/editar/deletar
//router.use(authMiddleware);

router.get("/", tabelaController.listar);
router.get("/:id", tabelaController.buscarPorId);
router.post("/", tabelaController.criar);
router.put("/:id", tabelaController.atualizar);
router.delete("/:id", tabelaController.deletar);

export default router;
