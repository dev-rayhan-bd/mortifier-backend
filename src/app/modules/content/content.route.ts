import { Router } from "express";
import { contentController } from "./content.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";

const router = Router();

router.post('/create', auth(), upload.single('file'), contentController.createContent)
router.get('/', auth(), contentController.getAllContent)
router.get('/my-content', auth(), contentController.getMyContent)
router.get('/:id', auth(), contentController.getSingleContent)


export const ContentRouter = router;