import { Router } from "express";
import assinaturaController from "../controllers/assinaturaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();


router.use(authMiddleware);

router.post("/criar", assinaturaController.criarAssinatura);
router.post("/webhook", assinaturaController.webhook);
router.post("/cancelar/:id",assinaturaController.cancelarAssinatura);
router.get("/status/:userId", assinaturaController.statusAssinatura);
router.get("/", assinaturaController.listar);
router.get("/usuario/:usuario_id", assinaturaController.buscarPorUsuario);
router.put("/:id", assinaturaController.atualizar);
router.delete("/:id", assinaturaController.deletar);

export default router;
