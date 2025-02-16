import { Router } from "express";
import { upload } from "../../helpers/fileUploader";
import { trainerController } from "./trainer.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.patch('/:id',
    upload.single('file'), auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), trainerController.updateTriner)
    router.get('/', auth(), trainerController.getAllTrainer)
    router.get('/analytics', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), trainerController.getTrainersByMonth)

export const TrainerRouter = router;