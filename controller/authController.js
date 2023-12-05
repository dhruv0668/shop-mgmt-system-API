import Blog from "../model/userModel.js";
import shopData from "../model/shopModel.js";
import shop_users from "../model/shop_users.js";
import { hashPassword, comparePassword } from "../helper/helper.js";
import Jwt from "jsonwebtoken";
import tokens from "../model/tokens.js";
import { validschema, loginValidSchema } from "../helper/validation.js";



// register controller with shop details add 

export const registerController = async (req, res) => {
    try {
        // password hashed
        const password = req.body.password
        const hashedPassword = await hashPassword(password);

        // get data for user collection
        const data = new Blog({
            name: req.body.name,
            contact: req.body.contact,
            password: hashedPassword,
            gender: req.body.gender,
        });


        // validation
        const { result } = await validschema.validateAsync(req.body, { abortEarly: false })

        // check user
        const contact = req.body.contact
        const existingUser = await Blog.findOne({ contact })
        if (existingUser) {
            return res.status(422).send({
                success: false,
                message: 'contact number already register please login',
                data: {
                    contact: 'contact is already register'
                }
            })
        }

        // data save in users collection
        let user = await data.save()

        // get data for shop collection
        const shop_data = new shopData({
            name: req.body.shop_name,
            contact: req.body.contact,
            address: req.body.address,
            user_id: user._id
        });

        let shop = await shop_data.save()

        // shop users
        const shopper = new shop_users({
            user_id: user._id,
            shop_id: shop._id
        });

        let shop_user = await shopper.save()

        // generate token when usre register
        const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

        // token save on database
        const auth = new tokens({
            user_id: user._id,
            token: token
        })

        let tok = await auth.save()

        res.status(200).send({
            success: true,
            message: "user register Successfully",
            data: {
                token: token
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
                message: "error in user register controller",
                data: {
                    error
                }
            })
    }
}

// login controller 

export const loginController = async (req, res) => {
    try {
        const { contact, password } = req.body;

        // validation
        const { result } = await loginValidSchema.validateAsync(req.body, { abortEarly: false })

        // check user
        const user = await Blog.findOne({ contact })
        if (!user) {
            return res.status(422).send({
                success: false,
                message: 'invalid contact or password',
                data: {

                }
            })
        }

        //check password
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(422).send({
                success: false,
                message: "invalid contact or password",
                data: {

                }
            })
        }

        // find staff from shop_users
        if (user.role === 1) {
            const shop_user = await shop_users.findOne({ user_id: user._id })
            if (!shop_user) {
                return res.status(401).send({
                    success: false,
                    message: "staff not found",
                    data: {

                    }
                })
            }

            if (shop_user.is_disable === true) {
                return res.status(401).send({
                    success: false,
                    message: "you are disable, you can not login",
                    data: {

                    }
                })
            }
        }

        // check owner is_disable
        const owner = await shop_users.findOne({ user_id: user._id })
        if (owner.is_disable === true) {
            return res.status(401).send({
                success: false,
                message: "you are disable, you can not login",
                data: {

                }
            })
        }

        // get user id
        const user_id = user._id

        // generate token when user login
        let token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });


        // token save on database
        const auth = new tokens({
            user_id: user._id,
            token: token
        })

        let tok = await auth.save()

        res.status(200).send({
            success: true,
            message: "login successfully",
            data: {
                token: token
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
                message: "error in login controller",
                data: {
                    error: error
                }
            })
    }
}

// user > me login auth

export const meController = async (req, res) => {
    try {

        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id

        const shop = await shopData.find({ user_id: userId })
        const shopp = shop.find(x => x.user_id = userId)


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


        // get user detail using id     
        const user = await Blog.findById(userId);
        console.log("user is", user)
        // condition for is_admin and staff
        if (user.role === 1) {

            const staf = await shop_users.find({ user_id: userId })
            const staff = staf.find(x => x.user_id = userId)

            const shop = await shopData.find({ _id: staff.shop_id })
            const shopp = shop.find(x => x._id = staff.shop_id)

            res.status(200).send({
                success: true,
                message: "login_user details",
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        contact: user.contact,
                        address: user.address,
                        role: user.role
                    },
                    shop: {
                        _id: shopp._id,
                        name: shopp.name,
                        user_id: user._id,
                        address: shopp.address
                    }
                }
            })
        } else {
            user.is_admin === 1 ?
                res.status(200).send({
                    success: true,
                    message: "login_user details",
                    data: {
                        user: {
                            _id: user._id,
                            name: user.name,
                            contact: user.contact,
                            address: user.address,
                            role: user.role
                        }
                    }
                })
                :
                res.status(200).send({
                    success: true,
                    message: "login_user details",
                    data: {
                        user: {
                            _id: user._id,
                            name: user.name,
                            contact: user.contact,
                            address: user.address,
                            role: user.role
                        },
                        shop: {
                            _id: shopp._id,
                            name: shopp.name,
                            user_id: user._id,
                            address: shopp.address
                        }
                    }
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in get user login details controller",
            data: {
                error: error
            }
        })
    }
}

// logout controller 

export const logoutController = async (req, res) => {
    try {
        // get token from authorization
        let auther = req.headers.authorization

        // split bearer
        let token = auther.split(" ")[1]

        // verify token and get user_id
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        var userId = decode._id

        const tokenn = await tokens.find({ user_id: userId, token: token })
        if (tokenn.length === 0) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }

        // find token from database
        const tek = tokenn.find(x => x.token === token)
        if (!tek) {
            return res.status(401).send({
                success: false,
                messaage: "unauthentication please login",
                data: {

                }
            })
        }
        const teek = tek.token
        // find and delete token
        await tokens.findOneAndDelete({ token: teek })

        res.status(200).send({
            success: true,
            message: "logout successfully",
            data: {

            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in logout controller",
            data: {
                error: error
            }
        })
    }
}


