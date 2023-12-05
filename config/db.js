import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect("mongodb://localhost:27017/tea_shop_mgmt");
        console.log("connection successfully on database")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;

