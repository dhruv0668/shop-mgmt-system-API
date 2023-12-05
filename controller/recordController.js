import daily_record from "../model/dailyRecordModel.js";
import Jwt from "jsonwebtoken";
import shopData from "../model/shopModel.js";
import shopMenu from "../model/shopMenuModel.js";
import customers from "../model/customerModel.js";
import Blog from "../model/userModel.js";
import shop_users from "../model/shop_users.js";
import tokens from "../model/tokens.js";
import { recordValidSchema, updateRecordValidSchema, dateValidSchema } from "../helper/validation.js";

// create daily record controller
export const createRecordController = async (req, res) => {
    try {
        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log(userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // validation using  Joi package
        const { result } = await recordValidSchema.validateAsync(req.body, { abortEarly: false })

        // get menu_id from body
        const customer_id = req.body.customer_id;
        console.log("customer_id is", customer_id)

        // find customer using customer_id  
        const customer = await customers.findOne({ _id: customer_id })
        console.log("customer is", customer)
        if (!customer) {
            return res.status(422).send({
                success: false,
                message: "customer not found please enter correct details",
                data: {

                }
            })
        }

        // // get menu_id from body
        const menu_id = req.body.menu_id;
        console.log("menu_id is", menu_id)

        // // get shop menu using menu_id and shop_id
        const shop_menu = await shopMenu.findOne({ _id: menu_id })
        console.log("shop menu is", shop_menu)
        if (!shop_menu) {
            return res.status(401).send({
                success: false,
                message: 'menu not found, enter correct details',
                data: {

                }
            })
        }

        // // calculate
        const quantity = req.body.quantity;
        const price = shop_menu.price;
        const total = quantity * price;

        // sell record save
        const data = new daily_record({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            menu_id: shop_menu._id,
            name: shop_menu.name,
            quantity: req.body.quantity,
            price: shop_menu.price,
            total: total,
            shop_id: userr.role === 0 ? shopp._id : staff.shop_id,
            customer_id: customer_id,
            user_id: userId
        })

        // //  record data save in database
        await data.save()

        res.status(200).send({
            success: true,
            message: "record save successfully",
            data
        })
    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in record controller",
                data: {
                    error: error
                }
            })
    }
}


// get all records
export const getAllRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // find daily record shop wise
        const data = await daily_record.find({ shop_id: shopId })
        if (data.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = data.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);


        res.status(200).send({
            success: true,
            message: "get all records successfully",
            data,
            total_record: data.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get all records controller",
            data: {
                error: error
            }
        })
    }
}


// get all records date-wise
export const dailyRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id


        // get date from body
        const date = req.body.date;
        if (!date) {
            return res.status(422).send({
                success: false,
                message: "unprocessable entity",
                data: {
                    date: "date is require"
                }
            })
        }

        const record = await daily_record.find({ shop_id: shopId, date: date })
        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);


        res.status(200).send({
            success: true,
            message: "get specific staff records successfully (daily)",
            record,
            total_record: record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get all records controller date-wise",
            data: {

            }
        })
    }
}


// get all records month-wise
export const monthlyRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const month = req.body.month;
        const year = req.body.year

        // validation using  Joi package
        const { result } = await dateValidSchema.validateAsync(req.body, { abortEarly: false })

        const record = await daily_record.find({ shop_id: shopId })
        let monthly_record = []

        for (let i = 0; i < record.length; i++) {
            const element = record[i];
            const rec = await daily_record.findOne({ _id: element._id })

            if (rec.date.split("/")[1] == month && rec.date.split("/")[2] == year) {
                monthly_record.push(rec)
            }
        }

        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = monthly_record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);

        res.status(200).send({
            success: true,
            message: "get specific staff records successfully (monthly)",
            monthly_record,
            total_record: monthly_record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in get all records month-wise",
                data: {
                    error: error
                }
            })
    }
}


// update customer record controller
export const updateRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log(userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // validation using  Joi package
        const { result } = await updateRecordValidSchema.validateAsync(req.body, { abortEarly: false })

        // get record_id from params
        const { id } = req.params;

        // // get menu_id from body
        const menu_id = req.body.menu_id;
        console.log("menu_id is", menu_id)

        // // get shop menu using menu_id and shop_id
        const shop_menu = await shopMenu.findOne({ menu_id: menu_id, shop_id: userr.role === 0 ? shopp._id : staff.shop_id })
        console.log("shop menu is", shop_menu)
        if (!shop_menu) {
            return res.status(422).send({
                success: false,
                message: 'menu not found, enter correct details',
                data: {

                }
            })
        }

        // // calculate
        const quantity = req.body.quantity;
        const price = shop_menu.price;
        const total = quantity * price;

        // update customer record
        const data = await daily_record.findByIdAndUpdate(id, {
            $set: {
                menu_id: shop_menu._id,
                name: shop_menu.name,
                quantity: req.body.quantity,
                price: shop_menu.price,
                total: total,
                shop_id: userr.role === 0 ? shopp._id : staff.shop_id,
            }
        }, { new: true })

        res.status(200).send({
            success: true,
            message: "update record successfully",
            data
        })

    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in update customer records controller",
                data: {
                    error: error
                }
            })
    }
}


// delete customer record controller
export const deleteRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log(userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // get customer record_id from params
        const { id } = req.params;

        // find record
        const record = await daily_record.findOne({ _id: id })
        console.log("record is", record)

        if (!record) {
            return res.status(422).send({
                success: false,
                message: "record not found",
                data: {

                }
            })
        }

        // delete record 
        const delete_data = await daily_record.deleteOne({ _id: id })

        res.status(200).send({
            success: true,
            message: "delete customer record successfully",
            data: {
                delete_data
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in delete customer records controller",
            data: {
                error: error
            }
        })
    }
}


// delete all customer record controller
export const deleteAllRecordsController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log(userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get customer_id from params
        const { id } = req.params;

        // find customer records
        const records = await daily_record.find({ customer_id: id, shop_id: shopId })
        if (records.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        // delete customer records all
        const delete_record = await daily_record.deleteMany({ customer_id: id, shop_id: shopId })

        res.status(200).send({
            success: true,
            message: "delete all records successfully",
            delete_record
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            messaage: "error in delete all customer records controller",
            data: {
                error: error
            }
        })
    }
}


///////////  records-controller   /////////////

//********** specific staff  ***********//
//***** staff can not use this API *****//



// get specific staff record (all)
export const getStaffRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;

        const record = await daily_record.find({ user_id: id, shop_id: shopId })
        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);

        res.status(200).send({
            success: true,
            message: "get specific staff records successfully (all)",
            record,
            total_record: record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get all specific staff records controller",
            data: {
                error: error
            }
        })
    }
}


// get specific staff record (daily) date wise
export const getDailyStaffRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;
        const date = req.body.date;
        if (!date) {
            return res.status(422).send({
                success: false,
                message: "unprocessable entity",
                data: {
                    date: "date is require"
                }
            })
        }

        const record = await daily_record.find({ user_id: id, shop_id: shopId, date: date })
        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);


        res.status(200).send({
            success: true,
            message: "get specific staff records successfully (daily)",
            record,
            total_record: record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in daily staff record controller",
            data: {
                error: error
            }
        })
    }
}


// get specific staff record (monthly)
export const getMonthlyStaffRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;
        const month = req.body.month;
        const year = req.body.year

        // validation using  Joi package
        const { result } = await dateValidSchema.validateAsync(req.body, { abortEarly: false })

        const record = await daily_record.find({ user_id: id, shop_id: shopId })
        let monthly_record = []

        for (let i = 0; i < record.length; i++) {
            const element = record[i];
            const rec = await daily_record.findOne({ _id: element._id })

            if (rec.date.split("/")[1] == month && rec.date.split("/")[2] == year) {
                monthly_record.push(rec)
            }
        }

        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = monthly_record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);

        res.status(200).send({
            success: true,
            message: "get specific staff records successfully (monthly)",
            monthly_record,
            total_record: monthly_record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in get specific staff record controller (monthly)",
                data: {
                    error: error
                }
            })
    }
}


//********** specific customer  ***********//
//******** staff can use this API *********//


// get specific customer record (all)
export const getCustomerRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get customer_id from body
        const { id } = req.params;

        // find daily record shop wise
        const data = await daily_record.find({ shop_id: shopId, customer_id: id })
        if (data.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = data.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);


        res.status(200).send({
            success: true,
            message: "all customer records successfully",
            data,
            total_record: data.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get all customer records controller",
            data: {
                error: error
            }
        })
    }
}


// get specific customer records (daily) date wise
export const getDailyCustomerRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        // if (userr.role === 1) {
        //     return res.status(401).send({
        //         success: false,
        //         message: "you are not owner or admin",
        //         data: {

        //         }
        //     })
        // }

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;
        const date = req.body.date;
        if (!date) {
            return res.status(422).send({
                success: false,
                message: "unprocessable entity",
                data: {
                    date: "date is require"
                }
            })
        }


        const record = await daily_record.find({ customer_id: id, shop_id: shopId, date: date })
        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);

        res.status(200).send({
            success: true,
            message: "get customer records successfully (date wise)",
            record,
            total_record: record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in customer records controller (daily)",
            data: {
                error: error
            }
        })
    }
}


// get specific customer records (monthly) compare date and year
export const getMonthlyCustomerRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;
        const month = req.body.month;
        const year = req.body.year

        // validation using  Joi package
        const { result } = await dateValidSchema.validateAsync(req.body, { abortEarly: false })

        const record = await daily_record.find({ customer_id: id, shop_id: shopId })
        let monthly_record = []

        for (let i = 0; i < record.length; i++) {
            const element = record[i];
            const rec = await daily_record.findOne({ _id: element._id })

            if (rec.date.split("/")[1] == month && rec.date.split("/")[2] == year) {
                monthly_record.push(rec)
            }
        }

        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        const amount = monthly_record.map(x => x.total)
        const sum = amount.reduce((partialSum, a) => partialSum + a, 0);

        res.status(200).send({
            success: true,
            message: "get specific customer records successfully (monthly)",
            monthly_record,
            total_record: monthly_record.length,
            total_amount: sum
        })

    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in get customer records controller (monthly)",
                data: {
                    error: error
                }
            })
    }
}


// delete monthly customer record controller
export const deleteMonthlyCustomerRecordController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id
        console.log("user_id is", userId)

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find user
        const user = await Blog.find({ _id: userId })
        const userr = user.find(x => x._id = userId)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)


        // find shop_id using userId
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (userr.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopId = userr.role === 0 ? shopp._id : staff.shop_id

        // get staff id from params
        const { id } = req.params;
        const month = req.body.month;
        const year = req.body.year;

        // validation using  Joi package
        const { result } = await dateValidSchema.validateAsync(req.body, { abortEarly: false })

        const record = await daily_record.find({ customer_id: id, shop_id: shopId })

        // check record lenght
        if (record.length === 0) {
            return res.status(200).send({
                success: true,
                message: "no any records",
                data: {

                }
            })
        }

        let monthly_record = []

        for (let i = 0; i < record.length; i++) {
            const element = record[i];
            const rec = await daily_record.findOne({ _id: element._id })

            if (rec.date.split("/")[1] == month && rec.date.split("/")[2] == year) {
                const rec = await daily_record.deleteOne({ _id: element._id })
                monthly_record.push(rec)
            }
        }


        const resultt = monthly_record.map(x => x.deletedCount)
        const sum = resultt.reduce((partialSum, a) => partialSum + a, 0)

        res.status(200).send({
            success: true,
            message: "delete specific customer records successfully (monthly)",
            data: {
                acknowledged: true,
                deletedCount: sum
            }
        })

    } catch (error) {
        console.log(error);
        (error.isJoi === true) ?
            res.status(422).send({
                success: false,
                message: "validation error",
                data: {
                    error: error.details.map(d => d.message)
                }
            }) :
            res.status(500).send({
                success: false,
                message: "error in delete monthly customer records controller",
                data: {
                    error: error
                }
            })
    }
}

