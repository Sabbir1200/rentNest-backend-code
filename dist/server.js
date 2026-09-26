
        import { createRequire }  from 'module';
        const require = createRequire(import.meta.url)
        
import n from"express";var o=n();o.use(n.json());o.get("/",(f,p)=>{p.send("Server is running ")});var e=o;import{configDotenv as i}from"dotenv";import{env as r}from"process";i();var s={NODE_ENV:r.NODE_ENV,PORT:r.PORT,DATABASE_URL:r.DATABASE_URL},t=s;t.NODE_ENV!=="production"&&e.listen(3e3,()=>{console.log("My server is running on 3000 port")});var u=e;export{u as default};
