import menu from "../model/menuModel.js";
import Jwt from "jsonwebtoken";
import shopMenu from "../model/shopMenuModel.js";
import shopData from "../model/shopModel.js";
import tokens from "../model/tokens.js";
import Blog from "../model/userModel.js";
import shop_users from "../model/shop_users.js";
import { shopMenuValidSchema } from "../helper/validation.js";


// get all menu controller
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
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in get menu",
            data: {
                error: error
            }
        })
    }
}

//create shop menu controller
export const createShopMenuController = async (req, res) => {
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
        if (owner.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // find shop data
        const shop = await shopData.find({ user_id: userId })
        console.log("shop is", shop)
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // get data from body
        const menu_id = req.body.menu_id;

        // validation
        const { result } = await shopMenuValidSchema.validateAsync(req.body, { abortEarly: false })

        // get menu name
        const menus = await menu.findOne({ _id: menu_id })
        if (!menus) {
            return res.status(422).send({
                success: false,
                message: "menu not found",
                data: {

                }
            })
        }

        // get shop_menu data from body
        const save_menu = new shopMenu({
            menu_id: req.body.menu_id,
            name: menus.name,
            price: req.body.price,
            shop_id: shopp._id
        })

        // check existing shop menu
        const shop_menu = await shopMenu.find({ menu_id: menu_id, shop_id: shopp._id })
        if (shop_menu.length >= 1) {
            return res.status(422).send({
                success: false,
                message: "unprocessable entity",
                data: {
                    manu: "menu already created"
                }
            })
        }

        // save shopMenu data in database
        await save_menu.save()

        res.status(200).send({
            success: true,
            message: "shop_menu create successfully",
            data: {
                menu_id: save_menu.menu_id,
                name: save_menu.name,
                price: save_menu.price,
                shop_id: save_menu.shop_id,
                disable: save_menu.disable
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
                message: "error in create shop_menu controller",
                data: {
                    error: error
                }
            })
    }
}

// get all shop menu controller
export const getShopMenuController = async (req, res) => {
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
        console.log("userr is", userr)

        const staf = await shop_users.find({ user_id: userr._id })
        const staff = staf.find(x => x.user_id = userr._id)

        // find shop_id using user_id
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

        // filter for staff and owner if user is staff so get only is_disable = flase data
        if (userr.role === 0) {
            const data = await shopMenu.find({ shop_id: userr.role === 0 ? shopp._id : staff.shop_id });
            res.status(200).send({
                success: true,
                message: "get all shop menu successfully",
                data
            })
        } else {
            const data = await shopMenu.find({ shop_id: userr.role === 0 ? shopp._id : staff.shop_id, is_disable: false });
            res.status(200).send({
                success: true,
                message: "get all shop menu successfully",
                data
            })
        }

    } catch (error) {
        console.log("get all shop menu", error)
        res.status(500).send({
            success: false,
            message: "error in get all shop menu controller",
            data: {
                error: error
            }
        })
    }
}

// update shop menu controller // can not use staff
export const updateShopMenuController = async (req, res) => {
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
        if (owner.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // find shop_id using user_id
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // get data from body
        // const menu_id = req.body.menu_id;
        const { id } = req.params;


        // get shop menu using shop_id
        const daata = await shopMenu.find({ shop_id: shopp._id, _id: id });
        console.log("data is", daata)

        // check data
        if (daata.length === 0) {
            return res.status(422).send({
                success: false,
                message: "menu not found please enter correct details",
                data: {

                }
            })
        }

        // find menu from shopMenu
        const menus = await shopMenu.findOne({ _id: id })
        console.log(menus)
        if (!menus) {
            return res.status(422).send({
                success: false,
                message: "menu not found",
                data: {

                }
            })
        }

        // // update shop menu
        const data = await shopMenu.findByIdAndUpdate(id, { $set: { price: req.body.price } }, { new: true })

        res.status(200).send({
            success: true,
            message: "update shop menu successfully",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in update shop menu controller",
            data: {
                error: error
            }
        })
    }
}

// delete shop menu controller
export const deleteShopMenuController = async (req, res) => {
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
        if (owner.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // find shop_id using user_id
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        const { id } = req.params;

        // get shop menu using shop_id
        const data = await shopMenu.find({ shop_id: shopp._id, _id: id });
        console.log("data is", data)

        // check data
        if (data.length === 0) {
            return res.status(422).send({
                success: false,
                message: "customer not found please enter correct details",
                data: {

                }
            })
        }

        // find menu from shopMenu
        const menus = await shopMenu.findOne({ id })
        console.log("menus is", menus)


        // // delete shop menu
        const delete_menu = await shopMenu.deleteOne({ _id: id })

        res.status(200).send({
            success: true,
            message: "shop menu delete successfully",
            data: {
                delete_menu
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in delete shop menu controller",
            data: {
                error: error
            }
        })
    }
}


// disable menu controller
export const disableShopMenuController = async (req, res) => {
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
        if (owner.role === 1) {
            return res.status(401).send({
                success: false,
                message: "you are not owner or admin",
                data: {

                }
            })
        }

        // find shop_id using user_id
        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)

        // check shop data
        if (shop.length === 0) {
            return res.status(422).send({
                success: false,
                message: "shop not found",
                data: {

                }
            })
        }

        // get id from params
        const { id } = req.params;

        const menus = await shopMenu.findOne({ _id: id })
        console.log(menus)
        if (!menus) {
            return res.status(422).send({
                success: false,
                message: "menu not found",
                data: {

                }
            })
        }


        if (menus.is_disable === false) {

            const data = await shopMenu.findByIdAndUpdate(id, { $set: { is_disable: true } }, { new: true })
            res.status(200).send({
                success: true,
                message: "disable menu successfully",
                data
            })

        } else {

            const data = await shopMenu.findByIdAndUpdate(id, { $set: { is_disable: false } }, { new: true })
            res.status(200).send({
                success: true,
                message: "enable menu successfully",
                data
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in disable or enable menu controller",
            data: {
                error: error
            }
        })
    }
}
