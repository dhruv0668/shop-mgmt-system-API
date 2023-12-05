import express from "express";
import {
    loginController,
    logoutController,
    meController,
    registerController
} from "../controller/authController.js";

const router = express.Router()


// register 
router.post("/register", registerController);


//login
router.post("/login", loginController);


// me login detail
router.get("/me", meController);


// logout 
router.get("/logout", logoutController);


export default router







