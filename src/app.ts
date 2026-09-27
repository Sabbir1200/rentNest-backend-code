import express, { type Application } from "express"
import { notFound } from "./middleware/not-found";


const app:Application = express();

app.use(express.json())

app.get('/', (req, res)=>{
    
    res.send("Server is running ")
})


app.use(notFound)

export default app;