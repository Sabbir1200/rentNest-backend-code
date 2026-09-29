import { Router } from "express";
import auth from "../../middleware/auth";
import landlordController from "./landlord.controller";

const landlordRouter = Router();

landlordRouter.post(
  "/properties",
  auth("LANDLORD"),
  landlordController.postProperty,
);

landlordRouter.put(
  "/properties/:id",
  auth("LANDLORD"),
  landlordController.putProperty,
);

landlordRouter.delete(
  "/properties/:id",
  auth("LANDLORD"),
  landlordController.removeProperty,
);

landlordRouter.get(
  "/requests",
  auth("LANDLORD"),
  landlordController.getRequests,
);

landlordRouter.patch(
  "/requests/:id",
  auth("LANDLORD"),
  landlordController.patchRequestStatus,
);

export default landlordRouter;
