import express from "express";
import {
    createMenuController,
    deleteMenuController,
    deleteUserController,
    disableUserController,
    getCustomersController,
    getMenuController,
    getShopsController,
    getUsersController,
    updateMenuController
} from "../controller/adminController.js";

const router = express.Router()

// get all users data
router.get("/users", getUsersController);


//get all shop data 
router.get("/shops", getShopsController);


// get all menu 
router.get("/menu", getMenuController);


//create menu
router.post("/menu/create", createMenuController);


// update menu usinf(menu_id)
router.put("/menu/:id", updateMenuController);


// delete menu (using menu_id)
router.delete("/menu/:id", deleteMenuController);


// get all customer 
router.get("/customers", getCustomersController);


//delete customer
router.delete("/users/:id", deleteUserController);


// disable or enable user (shop_owner)
router.put("/disable/user/:id", disableUserController);


export default router