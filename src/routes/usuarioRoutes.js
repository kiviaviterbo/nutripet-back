import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", usuarioController.criar);

router.use(authMiddleware);

router.put("/:id/senha", usuarioController.alterarSenha);
router.get("/premium/:id", usuarioController.verificarPremium);

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.buscarPorId);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);




export default router;
