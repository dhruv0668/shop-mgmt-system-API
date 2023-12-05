import express from "express";
import {
        createCustomerController,
        deleteCusromerController,
        disableCustomerController,
        getShopCustomersController,
        updateCustomerController
} from "../controller/customerController.js";


const router = express.Router()

// create customer router
router.post("/customer/create", createCustomerController)


// get customer shop-wise
router.get("/customers", getShopCustomersController);


// update customer shop-wise
router.put("/customer/:id", updateCustomerController);


// delete customer shop-wise
router.delete("/customer/:id", deleteCusromerController)

// is_disable customer
router.put("/customer/disable/:id", disableCustomerController)

export default router
