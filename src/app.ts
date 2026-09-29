import express, { type Application } from "express"
import { notFound } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import propertiesRouter from "./modules/properties/properties.routes";
import categoriesRouter from "./modules/categories/categories.routes";
import rentalRequestRouter from "./modules/rental-reqest/rental-request.routes";
import landlordRouter from "./modules/lanlord/landlord.route";
import adminRouter from "./modules/admin/admin.route";


const app:Application = express();

app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res)=>{
    
    res.send("Server is running ")
})

app.use("/api/auth", authRouter);
app.use("/api/auth", userRouter);
app.use("/api/properties",propertiesRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/rentals",rentalRequestRouter)
app.use("/api/landlord", landlordRouter)
app.use("/api/admin", adminRouter);



app.use(globalErrorHandler)
app.use(notFound)

export default app;