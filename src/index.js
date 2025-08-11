// require('dotenv').config({path : '/.env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({path : './.env'})

connectDB()




/*

import express from "express"
const app = express()

;( async () => {
    try {
        await mongoose.connect(`${process.env.Mongodb_URL}/${DB_NAME}`)
        app.on("error", (error) => { //listerner event of express
            console.log("error");
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log("App is listening"); 
            
        })

    } catch (error) {
        console.error("Error");
        throw error
    }
} )()

*/