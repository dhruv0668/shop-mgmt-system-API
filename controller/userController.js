import Jwt from "jsonwebtoken";
import Blog from "../model/userModel.js";
import shopData from "../model/shopModel.js";
import tokens from "../model/tokens.js";
import shop_users from "../model/shop_users.js";
import { hashPassword } from "../helper/helper.js";
import {
    updateUserValidSchema,
    updateShopValidSchema,
    staffValidSchema,
    updateStaffValidSchema,
} from "../helper/validation.js";


// update user data and also update contact in shopData
export const updateUserController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id;
        console.log(userId);

        // check user login
        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "authentication please login",
                data: {

                }
            })
        }

        // find customer
        const user_data = await Blog.find({ _id: userId })
        console.log(user_data.length)
        if (user_data.length === 0) {
            return res.status(422).send({
                success: false,
                message: "user not found",
                data: {

                }
            })
        }

        // find customer in object
        const user = user_data.find(x => x._id = userId)
        console.log("user is", user)

        // get data from body
        const update_name = req.body.name;
        const update_contact = req.body.contact;
        const update_gender = req.body.gender;

        // validation
        const { result } = await updateUserValidSchema.validateAsync(req.body, { abortEarly: false })

        // check user
        if (update_contact) {
            const existingUser = await Blog.find({ contact: update_contact })
            console.log("existingUser is", existingUser)

            if (existingUser.length === 1) {
                return res.status(422).send({
                    success: false,
                    message: 'contact is already register',
                    data: {
                        contact: 'contact is already register, add anothet contact'
                    }
                })
            }
        }

        // update user    *** user password cant update 
        const update_data = await Blog.findByIdAndUpdate(user._id, { $set: { name: update_name, contact: update_contact, gender: update_gender } })

        // find shop_id from shopData using user._id
        const shop = await shopData.find({ user_id: user._id })
        const shopp = shop.find(x => x.user_id = user._id)

        // check shop data
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // update contact in shopData using id  *** update contact in shopData because contact linked 
        const update_cont = await shopData.findByIdAndUpdate(shopp._id, { $set: { contact: update_contact } })

        // get updated data
        const updated_data = await Blog.find({ _id: userId })


        res.status(200).send({
            success: true,
            message: "user update successfully",
            data: {
                updated_data
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
                message: "erre in update user controller",
                data: {
                    error: error
                }
            })
    }
}


// update shop data  
export const updateShopController = async (req, res) => {
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
                messaage: "authentication please login",
                data: {

                }
            })
        }

        // find shop data
        const shop = await shopData.find({ user_id: userId })
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // find shop details in object
        const shopp = shop.find(x => x.user_id = userId)
        console.log(shopp)

        // get data from body
        const update_name = req.body.shop_name;
        const update_address = req.body.address;

        // validation
        const { result } = await updateShopValidSchema.validateAsync(req.body, { abortEarly: false })

        // update shop data  *** contact update in userUpdate API
        const update_data = await shopData.findByIdAndUpdate(shopp._id, { $set: { name: update_name, address: update_address } })

        // find updated data
        const updated_data = await shopData.find({ user_id: userId })


        res.status(200).send({
            success: true,
            message: "shop details update successfully",
            data: {
                updated_data
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
                message: "erroe in update shop controller",
                data: {
                    error: error
                }
            })
    }
}


/////////////  staff  //////////////


// create staff controller
export const createStaffController = async (req, res) => {
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

        // find user in object
        const userr = user.find(d => d._id = userId)

        // check is shop owner
        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }


        // get data from body
        const password = req.body.password;
        // password hashed
        const hashedPassword = await hashPassword(password);

        // get data for user collection
        const data = new Blog({
            name: req.body.name,
            contact: req.body.contact,
            password: hashedPassword,
            gender: req.body.gender,
            role: 1
        });

        // validation
        const { result } = await staffValidSchema.validateAsync(req.body, { abortEarly: false })

        // check user
        const contact = req.body.contact
        const existingUser = await Blog.findOne({ contact })
        if (existingUser) {
            return res.status(422).send({
                success: false,
                message: 'contact is already added',
                data: {

                }
            })
        }


        // find shop_id
        const shop = await shopData.find({ user_id: userId })
        console.log(shop)

        const shopp = shop.find(x => x.user_id = userId)

        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // shop users
        const shopper = new shop_users({
            user_id: data._id,
            shop_id: shopp._id
        });

        //  save data 
        await data.save()
        let shop_user = await shopper.save()

        res.status(200).send({
            success: true,
            message: "staff create successfully",
            data: {
                data
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
                message: "error in create staff controller",
                data: {
                    error: error
                }
            })
    }
}


// get staff   
export const getStaffController = async (req, res) => {
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

        // find user in object
        const userr = user.find(d => d._id = userId)

        // check is shop owner
        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not owner or admin",
                data: {

                }
            })
        }

        // find shop_id
        const shop = await shopData.find({ user_id: userId })
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const shopp = shop.find(x => x.user_id = userId)
        const shopppId = shopp._id;

        // find staff Id
        const staff = await shop_users.find({ shop_id: shopppId })
        let data = []
        if (staff.length > 0) {
            // find staff all
            let result = staff.map(a => a.user_id);

            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                const use = await Blog.find({ _id: element, role: 1 })
                const user = use.find(x => x._id = element)
                if (use.length > 0) {
                    data.push(user)
                }
            }

            res.status(200).send({
                success: true,
                message: "get staff details successfully",
                data
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "no staff found",
                data
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get  staff controller",
            data: {
                error: error
            }
        })
    }
}


// update staff controller (using owner and admin not staff)
export const updateStaffController = async (req, res) => {
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

        // find user in object
        const userr = user.find(d => d._id = userId)

        // check is shop owner
        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not owner or admin",
                data: {

                }
            })
        }


        // get data from body
        const { id } = req.params;
        const name = req.body.name;
        const contact = req.body.contact;
        const gender = req.body.gender

        // validation using joi
        const { result } = await updateStaffValidSchema.validateAsync(req.body, { abortEarly: false })

        // check conatct
        if (contact) {
            const existingStaff = await Blog.find({ contact: contact, role: 1 })
            console.log("existingUser is", existingStaff)

            if (existingStaff.length === 1) {
                return res.status(422).send({
                    success: false,
                    message: 'contact is already register',
                    data: {
                        contact: 'contact is already register, add anothet contact'
                    }
                })
            }
        }

        // find staff id using name and contact
        const data = await Blog.findOne({ _id: id })

        // check data
        if (!data) {
            return res.status(422).send({
                success: false,
                message: "staff not found, enter correct details",
                data: {

                }
            })
        }


        // find and update using staff id
        const update_staff = await Blog.findByIdAndUpdate(id, { $set: { name: name, contact: contact, gender: gender } }, { new: true })

        res.status(200).send({
            success: true,
            message: "update staff details successfully",
            data: {
                update_staff
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
                message: "error in update staff controller",
                data: {
                    error: error
                }
            })
    }
}


// delete staff controller (use owner and admin not staff)
export const deleteStaffController = async (req, res) => {
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
        console.log("token is", tokenn)
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

        // find user in object
        const userr = user.find(d => d._id = userId)

        // check is shop owner
        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not owner or admin",
                data: {

                }
            })
        }

        // get name and contact from body
        const { id } = req.params;

        // find staff using name and contact
        const staff = await Blog.find({ _id: id })
        if (!staff) {
            return res.status(422).send({
                success: false,
                message: "staff not found, enter correct details",
                data: {

                }
            })
        }


        // check staff 
        if (staff.length === 0) {
            return res.status(422).send({
                success: false,
                message: "staff not found, enter correct details",
                data: {

                }
            })
        }

        // find by Id and delete staff
        const delete_staff = await Blog.deleteOne({ _id: id })

        res.status(200).send({
            success: true,
            message: "delete staff successfully",
            data: {
                delete_staff
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in delete staff controller",
            data: {
                error: error
            }
        })
    }
}


// disable or enable staff controller
export const disableStaffController = async (req, res) => {
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

        // find user in object
        const userr = user.find(d => d._id = userId)

        // check is shop owner
        if (userr.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // get id from params
        const { id } = req.params;

        // find staff using id
        const staff = await shop_users.findOne({ user_id: id })
        if (!staff) {
            return res.status(401).send({
                success: false,
                message: "staff not found",
                data: {

                }
            })
        }

        if (staff.is_disable === false) {

            const data = await shop_users.findByIdAndUpdate(staff._id, { $set: { is_disable: true } }, { new: true })

            // delete staff token
            const delete_token = await tokens.deleteMany({ user_id: id })

            // get satff
            const staff_user = await Blog.findOne({ _id: id })


            res.status(200).send({
                success: true,
                message: "disable staff successfully",
                data,
                staff_user
            })

        } else {

            const data = await shop_users.findByIdAndUpdate(staff._id, { $set: { is_disable: false } }, { new: true })

            // get satff
            const staff_user = await Blog.findOne({ _id: id })

            res.status(200).send({
                success: true,
                message: "enable staff successfully",
                data,
                staff_user
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in disable or enable staff controller",
            data: {
                error: error
            }
        })
    }
}

