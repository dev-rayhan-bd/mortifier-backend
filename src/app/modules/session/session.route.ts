import { Router } from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";
import { sessionController } from "./session.controller";

const router = Router();

router.post('/create', auth(),
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]), sessionController.createSession)
    router.patch('/:id', auth(), upload.single('file'), sessionController.updateSession)

export const SessionRouter = router;