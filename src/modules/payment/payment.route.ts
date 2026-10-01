import { Router } from "express";
import auth from "../../middleware/auth";
import { checkout } from "./payment.controller";

const paymentRouter = Router();


paymentRouter.post("/checkout/:requestId",auth("TENANT"),checkout)


export default paymentRouter;