import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
// import validateRequest from "../../middlewares/validateRequest";
// import { userValidationSchema } from "./user.validation";

const router = Router();

router.post('/create-trainee',
    // validateRequest(userValidationSchema),
    userController.createTrainee)

router.post('/create-trainer', userController.createTrainer)
router.get('/get-me', auth(), userController.getMe)
// router.get('/get-me-trainee', auth(), userController.getMeTrainee)

export const UserRouter = router;