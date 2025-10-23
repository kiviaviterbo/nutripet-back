import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Rota para criar usuário não precisa de autenticação
router.post("/", usuarioController.criar);

// Rotas protegidas
//router.use(authMiddleware);
router.get("/", usuarioController.listar);
router.get("/premium/:id", usuarioController.verificarPremium);
router.get("/:id", usuarioController.buscarPorId);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);


export default router;
