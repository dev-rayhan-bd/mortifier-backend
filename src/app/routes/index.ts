import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { AdminRouter } from "../modules/admins/admin.route";
import { ChatsRouter } from "../modules/chats/chats.router";
import { ContentRouter } from "../modules/content/content.route";
import { SessionRouter } from "../modules/session/session.route";
import { TrainerRouter } from "../modules/trainer/trainer.route";
import { SpecialismRouter } from "../modules/specialism/specialism.route";
import { QualificationRouter } from "../modules/qualification/qualification.route";
import { TraineeRouter } from "../modules/trainee/trainee.route";
import { InvitationRouter } from "../modules/invitation/invitation.route";
import { reviewRouter } from "../modules/review/review.route";
import { followAndUnfollowRouter } from "../modules/follower/follower.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRouter,
    },
    {
        path: '/auth',
        route: AuthRouter,
    },
    {
        path: '/admin',
        route: AdminRouter,
    },
    {
        path: '/trainer',
        route: TrainerRouter,
    },
    {
        path: '/trainee',
        route: TraineeRouter,
    },
    {
        path: '/invitation',
        route: InvitationRouter,
    },
    {
        path: '/review',
        route: reviewRouter,
    },
    {
        path: '/follower',
        route: followAndUnfollowRouter,
    },
    {
        path: '/specialism',
        route: SpecialismRouter,
    },
    {
        path: '/qualification',
        route: QualificationRouter,
    },
    {
        path: '/content',
        route: ContentRouter,
    },
    {
        path: '/session',
        route: SessionRouter,
    },
    {
        path: '/chats',
        route: ChatsRouter,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;