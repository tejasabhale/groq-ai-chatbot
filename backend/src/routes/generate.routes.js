
import { Router } from "express";
import { generate } from "../controllers/generate.controller.js";

const router = Router();

router.post("/", generate);

export default router;
