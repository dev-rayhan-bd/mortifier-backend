import { Router } from "express";
import { invitationController } from "./invitation.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

router.post('/sent-invitation', auth(ENUM_USER_ROLE.TRAINER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), invitationController.sentInvitation)

// router.get('/:id', )

export const InvitationRouter = router;