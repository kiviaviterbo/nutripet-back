import { Router } from "express";
import petController from "../controllers/petController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Protegido: só usuários logados podem criar/editar/deletar
//router.use(authMiddleware);

router.get("/", petController.listar);
router.get("/:id", petController.buscarPorId);
router.post("/", petController.criar);
router.put("/:id", petController.atualizar);
router.delete("/:id", petController.deletar);

export default router;
