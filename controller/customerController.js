import customers from "../model/customerModel.js";
import shopData from "../model/shopModel.js";
import shop_customer from "../model/shopCustomersModel.js";
import Blog from "../model/userModel.js";
import tokens from "../model/tokens.js";
import Jwt from "jsonwebtoken";
import { customerValidschema, updateCustomerValidSchema } from "../helper/validation.js";
import shop_users from "../model/shop_users.js";

// create customer controller

export const createCustomerController = async (req, res) => {
    try {
        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id

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
        const tek = tokenn.find(x => x.token === token)
        if (!tek) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // check is owner or admin
        const owner = await Blog.findOne({ _id: userId })

        // find user
        const staff = await shop_users.findOne({ user_id: userId })
        console.log("staff is ", staff)

        // find shop data
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (owner.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }


        // get data from body
        const data = new customers({
            name: req.body.name,
            building_name: req.body.building_name,
            office_no: req.body.office_no,
            address: req.body.address,
            contact: req.body.contact,
            shop_id: owner.role === 0 ? shopp._id : staff.shop_id
        })

        // validation
        const { result } = await customerValidschema.validateAsync(req.body, { abortEarly: false })
        // existing user
        const existing_customer = await customers.find({ shop_id: owner.role === 0 ? shopp._id : staff.shop_id, contact: data.contact })
        console.log("existing customer", existing_customer.length)

        const existing_office = await customers.find({ shop_id: owner.role === 0 ? shopp._id : staff.shop_id, office_no: data.office_no })

        if (existing_customer.length >= 1 && existing_office.length >= 1) {
            return res.status(422).send({
                success: false,
                message: "office_no and contact already created",
                data: {
                    office_no: "office_no already created",
                    contact: "contact already created"
                }
            })
        }

        // existing customer condition
        if (existing_customer.length >= 1 || existing_office.length >= 1) {
            if (existing_customer.length >= 1) {
                return res.status(422).send({
                    success: false,
                    message: "existing_customer",
                    data: {
                        contact: "contact already created"
                    }
                })
            } else {
                return res.status(422).send({
                    success: false,
                    message: "existing_customer",
                    data: {
                        office_no: "office_no already created"
                    }
                })
            }
        }


        //save data in customers collection
        const customer = await data.save()

        // get data for shop_customers collection
        const shop_cust = new shop_customer({
            shop_id: owner.role === 0 ? shopp._id : staff.shop_id,
            customer_id: data._id
        })

        // save data in shop_customers collection
        await shop_cust.save()

        res.status(200).send({
            success: true,
            message: "customer successfully created",
            data: {
                _id: data._id,
                name: data.name,
                building_name: data.building_name,
                office_no: data.office_no,
                address: data.address,
                contact: data.contact,
                shop_id: owner.role === 0 ? shopp._id : staff.shop_id
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
                message: "error in create customer controller",
                data: {
                    error: error
                }
            })
    }
}

// get customer shop-wise

export const getShopCustomersController = async (req, res) => {
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

        // check is owner or admin
        const owner = await Blog.findOne({ _id: userId })

        // find user
        const staff = await shop_users.findOne({ user_id: userId })
        console.log("staff is ", staff)

        // find shop data
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (owner.role === 0 && shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // filter condition if user is staff so get only enable customer
        if (owner.role === 0) {
            const data = await customers.find({ shop_id: owner.role === 0 ? shopp._id : staff.shop_id });
            res.status(200).send({
                success: true,
                message: "get all customer successfully",
                data
            })
        } else {
            const data = await customers.find({ shop_id: owner.role === 0 ? shopp._id : staff.shop_id, is_disable: false });
            res.status(200).send({
                success: true,
                message: "get all customer successfully",
                data
            })
        }





    } catch (error) {
        console.log("get customer", error)
        res.status(500).send({
            success: false,
            message: "error in get customer controller",
            data: {
                error: error
            }
        })
    }
}

// update customer shop wise 

export const updateCustomerController = async (req, res) => {
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

        // get data from body
        const { id } = req.params;
        const update_name = req.body.name;
        const update_building = req.body.building_name;
        const update_office = req.body.office_name;
        const update_address = req.body.address;
        const update_contact = req.body.contact;

        // validation
        const { result } = await updateCustomerValidSchema.validateAsync(req.body, { abortEarly: false })

        // get customer using shop_id
        const daata = await customers.findOne({ _id: id });
        console.log("data is", daata)

        // check data
        if (!daata) {
            return res.status(422).send({
                success: false,
                message: "customer not found please enter correct details",
                data: {

                }
            })
        }

        // update customer
        const data = await customers.findByIdAndUpdate(id, { $set: { name: update_name, office_no: update_office, building_name: update_building, address: update_address, contact: update_contact } }, { new: true })

        res.status(200).send({
            success: true,
            message: "customer update successfully",
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
                message: "error in update customer controller",
                data: {
                    error: error
                }
            })
    }
}

// delete customer shop wise

export const deleteCusromerController = async (req, res) => {
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


        // get id from params
        const { id } = req.params;

        // get customer using shop_id
        const data = await customers.findOne({ _id: id });

        // check data
        if (!data) {
            return res.status(422).send({
                success: false,
                message: "customer not found please enter correct details",
                data: {

                }
            })
        }

        // delete customer
        const delete_customer = await customers.deleteOne({ _id: id })

        res.status(200).send({
            success: true,
            message: "delete customer successfully",
            data: {
                delete_customer
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "erroe in delete customer controller",
            data: {
                error: error
            }
        })
    }
}


// disable customer controller
export const disableCustomerController = async (req, res) => {
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

        // check is owner or amdin
        const owner = await Blog.findOne({ _id: userId })
        if (owner.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // get id from params
        const { id } = req.params;

        // find customer using id
        const customer = await customers.findOne({ _id: id })
        if (!customer) {
            return res.status(422).send({
                success: false,
                message: "customer not found",
                data: {

                }
            })
        }

        if (customer.is_disable === false) {

            const data = await customers.findByIdAndUpdate(id, { $set: { is_disable: true } }, { new: true })
            res.status(200).send({
                success: true,
                message: "disable customer successfully",
                data
            })

        } else {

            const data = await customers.findByIdAndUpdate(id, { $set: { is_disable: false } }, { new: true })
            res.status(200).send({
                success: true,
                message: "enable customer successfully",
                data
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in disable or enable customer controller",
            data: {
                error: error
            }
        })
    }
}


