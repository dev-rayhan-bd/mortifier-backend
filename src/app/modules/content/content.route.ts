import { Router } from "express";
import { contentController } from "./content.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";

const router = Router();

router.post('/create', auth(), upload.single('file'), contentController.createContent)
router.get('/', contentController.getAllContent)
router.get('/my-content', auth(), contentController.getMyContent)
router.get('/:id', auth(), contentController.getSingleContent)
router.patch('/:id', auth(), upload.single('file'), contentController.updateContent)


export const ContentRouter = router;