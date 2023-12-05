import Joi from "joi";


// register user validation
export const validschema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    shop_name: Joi.string().min(3).max(20).required(),
    contact: Joi.string().min(10).max(10).required(),
    address: Joi.string().required(),
    password: Joi.string().min(8).max(12).required(),
    gender: Joi.string().required().valid("male", "female")
}).unknown(false)

// staff validation
export const staffValidSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    contact: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(8).max(12).required(),
    gender: Joi.string().required().valid("male", "female")
}).unknown(false)

// update staff validation
export const updateStaffValidSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    contact: Joi.string().min(10).max(10).required(),
    gender: Joi.string().valid("male", "female")
}).unknown(false)

// update user validation
export const updateUserValidSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    contact: Joi.string().min(10).max(10),
    gender: Joi.string().valid("male", "female")
}).unknown(false)

// update shop data validation
export const updateShopValidSchema = Joi.object({
    shop_name: Joi.string().min(3).max(20),
    address: Joi.string()
}).unknown(false)


// login validation
export const loginValidSchema = Joi.object({
    contact: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(8).max(12).required()
}).unknown(false)


// customer validation
export const customerValidschema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    building_name: Joi.string().min(3).max(15).required(),
    office_no: Joi.string().min(3).max(6).required(),
    address: Joi.string().required(),
    contact: Joi.string().min(10).max(10).required()
}).unknown(false)


//create shop menu validation
export const shopMenuValidSchema = Joi.object({
    menu_id: Joi.string().required(),
    price: Joi.number().required()
}).unknown(false)


// create daily record validation
export const recordValidSchema = Joi.object({
    customer_id: Joi.string().required(),
    menu_id: Joi.string().required(),
    quantity: Joi.number().required()
}).unknown(false)


// update customer records
export const updateRecordValidSchema = Joi.object({
    menu_id: Joi.string().required(),
    quantity: Joi.number().required()
}).unknown(false)


// update customer validaton /// proparty : name, update_building_name, update_office_name, address, contact
export const updateCustomerValidSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    building_name: Joi.string(),
    office_name: Joi.string(),
    address: Joi.string(),
    contact: Joi.string().min(10).max(10)
}).unknown(false)


//update menu validation (admin use)
export const updateMenuValidSchema = Joi.object({
    name: Joi.string().required()
}).unknown(false)


// create menu and delete validation (admin use)
export const createMenuValidSchema = Joi.object({
    name: Joi.string().required()
}).unknown(false)

// month and year validation
export const dateValidSchema = Joi.object({
    month: Joi.number().max(12).required(),
    year: Joi.number().min(2000).max(2050).required()
})
