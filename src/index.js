import dotenv from "dotenv"

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"
import DBconnect from "./db/index.js";
import { app } from "./app.js";
dotenv.config({path: './.env'})

DBconnect()  // returns a promise
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error: ",err)
})



/*
import express from "express"
const app = express()
;( async ()=>{
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error", ()=>{
                console.error("error: ", error)
                throw error
            })

            app.listen(process.env.PORT, ()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
            })
        } catch (error) {
            console.error("Error: ", error)
            throw error
        }
})()
*/
