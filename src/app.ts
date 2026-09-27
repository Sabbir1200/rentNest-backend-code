import express, { type Application } from "express"
import { notFound } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import propertiesRouter from "./modules/properties/properties.routes";


const app:Application = express();

app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res)=>{
    
    res.send("Server is running ")
})

app.use("/api/auth", authRouter);
app.use("/api/auth", userRouter);
app.use("/api/properties",propertiesRouter)



app.use(globalErrorHandler)
app.use(notFound)

export default app;