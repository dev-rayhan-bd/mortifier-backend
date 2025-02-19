import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { purchaseAccessController } from "./purchaseAccess.controller";


const router = Router();

router.get('/check-existence', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.checkEnrollment)
router.get('/my-enrolled-session', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.myEnrolledSesion)
router.get('/total-enrollment/:id', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.getTotalEnrollment)
router.post('/enroll', auth(ENUM_USER_ROLE.TRAINEE, ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), purchaseAccessController.enrollNow)


export const PurchaseAccessRouter = router;