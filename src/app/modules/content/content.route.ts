import { Router } from "express";
import { contentController } from "./content.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";

const router = Router();

router.post('/create', auth(), upload.single('file'), contentController.createContent)


export const ContentRouter = router;