
import app from "./app";
import config from "./config";


if(config.NODE_ENV !== "production"){
    app.listen(3000,()=>{
    console.log("My server is running on 3000 port")
})
}else{

}
export default app;
