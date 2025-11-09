import { Router } from "express";
import tabelaController from "../controllers/tabelaController.js";

const router = Router();

// rotas diretas (o prefixo /tabelas já vem do index.js)
router.post("/", tabelaController.criar);
router.get("/", tabelaController.listar);
router.get("/filtros", tabelaController.filtros);
router.get("/:id", tabelaController.buscarPorId);
router.put("/:id", tabelaController.atualizar);
router.delete("/:id", tabelaController.deletar);

export default router;
