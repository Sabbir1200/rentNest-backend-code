import { Router } from "express";
import allCategories from "./categories.controller";

const categoriesRouter = Router();

categoriesRouter.get("/", allCategories);


export default categoriesRouter;