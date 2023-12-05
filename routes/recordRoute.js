import express from "express";
import {
    createRecordController,
    dailyRecordsController,
    deleteAllRecordsController,
    deleteMonthlyCustomerRecordController,
    deleteRecordsController,
    getAllRecordsController,
    getCustomerRecordController,
    getDailyCustomerRecordController,
    getDailyStaffRecordController,
    getMonthlyCustomerRecordController,
    getMonthlyStaffRecordController,
    getStaffRecordController,
    monthlyRecordsController,
    updateRecordsController
} from "../controller/recordController.js";


const router = express.Router()

// daily record route
router.post("/records/create", createRecordController)


// get all records 
router.get("/records", getAllRecordsController)


// get all records date-wise
router.post("/records/daily", dailyRecordsController)


// get all records month-wise
router.post("/records/monthly", monthlyRecordsController)


// update customer record  (use record_id)
router.put("/records/:id", updateRecordsController)


// delete customer record  (use record_id)
router.delete("/records/:id", deleteRecordsController)


// delete all customer records  (use customer_id)
router.delete("/records/all/:id", deleteAllRecordsController)


///////////  records routes //////////////

//********** specific staff  ***********//

// get specific staff record (all)
router.get("/selling/records/:id", getStaffRecordController)


// get specific staff record (daily)
router.post("/selling/records/daily/:id", getDailyStaffRecordController)


// get specific staff record (monthly)
router.post("/selling/records/monthly/:id", getMonthlyStaffRecordController)


//********** specific customer  ***********//

// get specific customer record (all)
router.get("/customer/records/:id", getCustomerRecordController)


// get specific customer records (daily) 
router.post("/customer/records/daily/:id", getDailyCustomerRecordController)


// get specific customer records (monthly)
router.post("/customer/records/monthly/:id", getMonthlyCustomerRecordController)


// delete monthly customer record 
router.delete("/records/delete/monthly/:id", deleteMonthlyCustomerRecordController)



export default router