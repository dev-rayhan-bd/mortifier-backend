import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { AdminRouter } from "../modules/admins/admin.route";
import { ChatsRouter } from "../modules/chats/chats.router";
import { ContentRouter } from "../modules/content/content.route";
import { SessionRouter } from "../modules/session/session.route";
import { TrainerRouter } from "../modules/trainer/trainer.route";

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