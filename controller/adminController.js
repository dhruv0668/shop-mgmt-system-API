import shopData from "../model/shopModel.js";
import Jwt from "jsonwebtoken";
import Blog from "../model/userModel.js";
import menu from "../model/menuModel.js";
import tokens from "../model/tokens.js";
import shop_users from "../model/shop_users.js";
import customers from "../model/customerModel.js";
import { updateMenuValidSchema, createMenuValidSchema } from "../helper/validation.js";

//get all user
export const getUsersController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // find users data
        const users = await Blog.find({ role: 0 })

        res.status(200).send({
            success: true,
            message: "get all shop details successfully",
            data: {
                users
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in get user controller",
            data: {

            }
        })
    }
}


// get all shop-data
export const getShopsController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // find shop data
        const shop = await shopData.find()


        res.status(200).send({
            success: true,
            message: "get all shop details successfully",
            data: {
                shop
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in get shop controller",
            data: {
                error: error
            }
        })
    }
}


// create menu
export const createMenuController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }


        // get menu name from body
        const menu_name = req.body.name;

        // validation
        const { result } = await createMenuValidSchema.validateAsync(req.body, { abortEarly: false })

        // check menu
        const menuu = await menu.find({ name: menu_name })

        if (menuu.length >= 1) {
            return res.status(422).send({
                success: false,
                message: "unprocessable entity",
                data: {
                    name: "this name already created"
                }
            })
        }


        const data = await new menu({
            name: menu_name
        })

        const menus = await data.save()

        res.status(200).send({
            success: true,
            message: "menu create successfully",
            data: {
                menu: {
                    _id: data._id,
                    name: data.name
                }
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
                message: "error in create menu controller",
                data: {
                    error: error
                }
            })
    }
}


// get all menu
export const getMenuController = async (req, res) => {
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

        const data = await menu.find()
        console.log(data)

        res.status(200).send({
            success: true,
            message: "menu get successfully",
            data: {
                data: data
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in get menu controller",
            data: {
                error: error
            }
        })
    }
}


// update menu controller 
export const updateMenuController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // get menu_name and update_name from body
        const { id } = req.params;
        const name = req.body.name;

        // validation
        const { result } = await updateMenuValidSchema.validateAsync(req.body, { abortEarly: false })

        // find menu details using menu_name
        const data = await menu.findOne({ _id: id })

        // check menu
        if (!data) {
            return res.status(422).send({
                success: false,
                message: "menu not found",
                data: {

                }
            })
        }

        // update menu
        const update_menu = await menu.findByIdAndUpdate(id, { $set: { name: name } }, { new: true })

        // save updated menu
        await update_menu.save()

        res.status(200).send({
            success: true,
            message: "menu update successfully",
            data: {
                update_menu
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
                message: "error in update menu",
                data: {
                    error: error
                }
            })
    }
}


// delete menu controller 
export const deleteMenuController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // get menu_name from body
        const { id } = req.params;

        // validation
        // const { result } = await createMenuValidSchema.validateAsync(req.body, { abortEarly: false })

        // check menu
        const menuu = await menu.findOne({ _id: id })

        // check menu menuu length === 0 => return
        if (!menuu) {
            return res.status(422).send({
                success: false,
                message: "menu not found",
                data: {

                }
            })
        }

        // delete menu
        const delete_menu = await menu.deleteOne({ _id: id })

        res.status(200).send({
            success: true,
            message: "menu delate successfully",
            data: {
                delete_menu
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in delete menu controller",
            data: {
                error: error
            }
        })
    }
}


// get all customers 
export const getCustomersController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // get customers
        const data = await customers.find();

        res.status(200).send({
            success: true,
            message: "get all customer successfully",
            data: {
                data
            }
        })

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


// delete user and shop
export const deleteUserController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // get name and password from body
        const { id } = req.params;

        // find user data using name and contact
        const user_data = await Blog.findOne({ _id: id })

        // check user data
        if (!user_data) {
            return res.status(422).send({
                success: false,
                message: "user not found",
                data: {

                }
            })
        }

        // delete user
        const delete_user = await Blog.deleteOne({ _id: id })
        // delete shop 
        const delete_shop = await shopData.deleteOne({ user_id: id })

        res.status(200).send({
            success: true,
            message: "delete user successfully",
            data: {
                delete_user,
                delete_shop
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in delete user controller",
            data: {
                error: error
            }
        })
    }
}

// disable or enable user controller
export const disableUserController = async (req, res) => {
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
        const admin = user.find(x => x._id = userId)

        // check is_admin
        if (admin.is_admin === 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorized, you are not admin",
                data: {

                }
            })
        }

        // get user id from params
        const { id } = req.params;

        // find user
        const shop_owner = await shop_users.findOne({ user_id: id })
        if (!shop_owner) {
            return res.status(401).send({
                success: false,
                message: "user not found",
                data: {

                }
            })
        }

        // disable or enable user condition
        if (shop_owner.is_disable === false) {

            const data = await shop_users.findByIdAndUpdate(shop_owner._id, { $set: { is_disable: true } }, { new: true })

            // delete staff token
            const delete_token = await tokens.deleteMany({ user_id: id })

            // get satff
            const owner = await Blog.findOne({ _id: id })

            // get shop id
            const shop = await shopData.findOne({ user_id: id })

            // find shop_users
            const shop_user = await shop_users.find({ shop_id: shop._id })

            for (let i = 0; i < shop_user.length; i++) {
                const element = shop_user[i];

                // disable staff
                const staff = await shop_users.findByIdAndUpdate(element._id, { $set: { is_disable: true } }, { new: true })

                // delete token
                const token = await tokens.deleteMany({ user_id: element.user_id })

            }

            res.status(200).send({
                success: true,
                message: "disable owner successfully",
                data,
                owner
            })

        } else {

            // enable shop_owner
            const data = await shop_users.findByIdAndUpdate(shop_owner._id, { $set: { is_disable: false } }, { new: true })

            // get owner
            const owner = await Blog.findOne({ _id: id })

            // get shop id
            const shop = await shopData.findOne({ user_id: id })

            // enable staff
            const staff = await shop_users.updateMany({ shop_id: shop._id }, { $set: { is_disable: false } }, { new: true })


            res.status(200).send({
                success: true,
                message: "enable owner successfully",
                data,
                owner
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in disable or enable user controller",
            data: {
                error: error
            }
        })
    }
}