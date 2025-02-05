import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../helpers/fileUploader";
// import validateRequest from "../../middlewares/validateRequest";
// import { userValidationSchema } from "./user.validation";

const router = Router();

router.post('/create-trainee',
    upload.single('file'),
    // validateRequest(userValidationSchema),
    userController.createTrainee)

router.post('/create-trainer', 
    upload.single('file'),
    userController.createTrainer)
router.get('/get-me', auth(), userController.getMe)
router.get('/view-user/:id', auth(), userController.viewUser)
// router.get('/get-me-trainee', auth(), userController.getMeTrainee)

export const UserRouter = router;