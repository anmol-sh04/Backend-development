import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(cors({
    origin : process.env.COR_ORIGIN,
    credentials: true
}))  
// .use() is mostly used for middlewares 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// import routes
import router from "./routes/user.routes.js"
app.use("/api/v1/users", router)
// http://localhost:8000/api/v1/users/register
export {app}