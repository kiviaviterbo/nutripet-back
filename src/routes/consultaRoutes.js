import { Router } from "express";
import consultaController from "../controllers/consultaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadPDF } from "../middlewares/uploadPDF.js";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadPDF.single("documento"), consultaController.criar);
router.get("/usuario/:usuario_id", consultaController.listarPorUsuario);
router.put("/cancelar/:id", consultaController.cancelar);

export default router;
