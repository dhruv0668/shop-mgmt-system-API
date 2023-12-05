import express from "express";
import authRoute from "./routes/authRoute.js";
import customerRoute from "./routes/customerRoute.js";
import menuRoute from "./routes/menuRoute.js";
import recordRoute from "./routes/recordRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// work not done
//..1 if url false so handle error 

// today work is
// 1 create disable or enable staff API and add some functionality like if disable = true so all staff token delete and can not login  
// 2 create disable or enable shop_owner API and add functionality to all shop staff disable or enable and all token delete when owner is disable or enable 
// 3 clear all data in database and check all API
// 4 fix some isshu in login API and add some condition


// tooday work is
// add some functionality in all API's like, if add false url so get json response

//database config
connectDB()

// configure env
dotenv.config()

//rest object
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))  // a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using

// test
app.get("/test", (req, res) => {
    res.send("test")
})


// routes

//register, login, me, logout
app.use("/api/user", authRoute)

// user update
app.use("/api/user", userRoute)

//create-customer
app.use("/api/user", customerRoute)

// create-menu, getMenu, cretae-shopMenu
app.use("/api/user", menuRoute)

// create-dailyRecord
app.use("/api/user", recordRoute)

// admin routes
app.use("/api/admin", adminRoute)

// json response if API url's false

app.get("*", (req, res) => {
    res.status(404).send({
        success: false,
        message: "url not found",
        data: {

        }
    })
})

app.post("*", (req, res) => {
    res.status(404).send({
        success: false,
        message: "url not found",
        data: {

        }
    })
})

app.put("*", (req, res) => {
    res.status(404).send({
        success: false,
        message: "url not found",
        data: {

        }
    })
})

app.delete("*", (req, res) => {
    res.status(404).send({
        success: false,
        message: "url not found",
        data: {

        }
    })
})

// port
const PORT = process.env.PORT
app.listen(PORT, "192.168.1.5", (req, res) => {
    console.log(`app is running on port ${PORT}`)
})
