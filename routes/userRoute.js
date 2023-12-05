import express from "express";
import {
    createStaffController,
    deleteStaffController,
    disableStaffController,
    getStaffController,
    updateShopController,
    updateStaffController,
    updateUserController
} from "../controller/userController.js";

const router = express.Router()


// update user data
router.put("/user-update", updateUserController);


// update shop data
router.put("/shop-update", updateShopController)


//////////  staff  //////////

// create shop staff ( owner and admin use )
router.post("/staff/create", createStaffController)


// get staff 
router.get("/staff", getStaffController)


// update staff  (owner and admin use)
router.put("/staff/:id", updateStaffController)


// delete staff (owner and admin use not staff)
router.delete("/staff/:id", deleteStaffController)


// enable or disable staff (owner use)
router.put("/disable/staff/:id", disableStaffController)


export default router