import { Router } from "express";
import auth from "../../middlewares/auth";
import { traineeController } from "./trainee.controller";

const router = Router();

router.get('/', auth(), traineeController.getAllTrainee)


export const TraineeRouter = router;