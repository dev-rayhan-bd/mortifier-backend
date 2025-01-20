import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { contentValidatedSchema } from "./content.validation";
import { contentController } from "./content.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/create',
    validateRequest(contentValidatedSchema), auth(), contentController.createContent)


export const ContentRouter = router;