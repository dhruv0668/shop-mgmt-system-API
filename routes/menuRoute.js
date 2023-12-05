import express from "express";
import {
        createShopMenuController,
        deleteShopMenuController,
        disableShopMenuController,
        getMenuController,
        getShopMenuController,
        updateShopMenuController
} from "../controller/menuController.js";


// admin work

const router = express.Router()

// get all menu
router.get("/menu", getMenuController);


// create shop menu 
router.post("/shop-menu/create", createShopMenuController);


// get all shop menu
router.get("/shop-menu", getShopMenuController);


// update shop menu 
router.put("/shop-menu/:id", updateShopMenuController)


// delete shop menu
router.delete("/shop-menu/:id", deleteShopMenuController)

// disable menu
router.put("/shop-menu/disable/:id", disableShopMenuController)


export default router