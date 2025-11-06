import { Router } from "express";
import assinaturaController from "../controllers/assinaturaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Protegido: só usuários logados podem criar/editar/deletar
router.use(authMiddleware);

router.get("/", assinaturaController.listar);
router.get("/usuario/:usuario_id", assinaturaController.buscarPorUsuario);
router.post("/", assinaturaController.criar);
router.put("/:id", assinaturaController.atualizar);
router.delete("/:id", assinaturaController.deletar);

export default router;
