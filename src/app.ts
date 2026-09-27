import express, { type Application } from "express"
import { notFound } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";


const app:Application = express();

app.use(express.json())

app.get('/', (req, res)=>{
    
    res.send("Server is running ")
})


app.use(globalErrorHandler)
app.use(notFound)

export default app;