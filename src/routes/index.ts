import { Router } from "express";
import multer from "multer";

import * as authController from "~controllers/auth.controller";
import * as imageController from "~controllers/image.controller";
import { authGuard } from "~middleware/index";

const baseRouter = Router();
const authRouter = Router();
const userRouter = Router();
const imageRouter = Router();

const upload = multer({});

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);

imageRouter.post("/", authGuard, upload.array("images", 12), imageController.upload);
imageRouter.patch("/:id", authGuard, imageController.editPermission);
imageRouter.delete("/", authGuard, imageController.deleteMany);
imageRouter.delete("/all", authGuard, imageController.deleteAll);
imageRouter.delete("/:id", authGuard, imageController.deleteOne);

baseRouter.use("/auth", authRouter);
baseRouter.use("/users", userRouter);
baseRouter.use("/images", imageRouter);

export default baseRouter;