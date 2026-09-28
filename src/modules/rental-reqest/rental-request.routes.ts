import { Router } from "express";
import auth from "../../middleware/auth";
import  rentalRequest  from "./rental-request.controller";

const rentalRequestRouter = Router();

rentalRequestRouter.post("/",auth("TENANT"), rentalRequest.postRentalRequest )
rentalRequestRouter.get(
  "/",
  auth("TENANT"),
  rentalRequest.getMyRentalRequests
);

rentalRequestRouter.get(
  "/:id",
  auth("TENANT"),
  rentalRequest.getRentalRequestDetails
);

export default rentalRequestRouter;