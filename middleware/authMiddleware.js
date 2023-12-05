import Jwt from "jsonwebtoken";


export const verifyToken = async (req, res, next) => {
    try {
        let auth = req.headers.authorization


        let token = auth.split(" ")[1]
        console.log(token)

        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
        res.status(200).send({
            success: true,
            message: "token verify"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in token verify"
        })
    }
}
