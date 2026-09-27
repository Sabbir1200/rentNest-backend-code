import { Router } from "express";
import { propertiesController } from "./properties.controller";

const propertiesRouter = Router();



propertiesRouter.get("/",propertiesController.getProperties)
propertiesRouter.get("/:id",propertiesController.getProperty)



export default propertiesRouter;