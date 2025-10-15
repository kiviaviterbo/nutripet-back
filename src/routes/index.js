import express from "express";
import exampleController from "../controllers/exampleController.js";

const router = express.Router();
router.get("/", exampleController.hello);

export default router;
