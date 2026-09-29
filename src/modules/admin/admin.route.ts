import { Router } from "express";
import auth from "../../middleware/auth";
import adminController from "./admin.controller";

const adminRouter = Router();

adminRouter.get(
  "/users",
  auth("ADMIN"),
  adminController.getUsers
);

adminRouter.patch(
  "/users/:id",
  auth("ADMIN"),
  adminController.patchUserStatus
);

adminRouter.get(
  "/properties",
  auth("ADMIN"),
  adminController.getProperties
);

adminRouter.get(
  "/rentals",
  auth("ADMIN"),
  adminController.getRentals
);

export default adminRouter;