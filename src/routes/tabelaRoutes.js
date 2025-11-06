import { Router } from "express";
import tabelaController from "../controllers/tabelaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinaryConfig.js"; 
const router = Router();

// router.use(authMiddleware);

router.get("/", tabelaController.listar);
router.get("/:id", tabelaController.buscarPorId);
router.post("/", upload.single("imagem"), tabelaController.criar);
router.put("/:id", upload.single("imagem"), tabelaController.atualizar);
router.delete("/:id", tabelaController.deletar);

export default router;
