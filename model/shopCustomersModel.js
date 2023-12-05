import mongoose from "mongoose";
const { Schema } = mongoose;

const shopCustomersSchema = new Schema({
    shop_id: {type: mongoose.ObjectId, ref: 'shops', required: true },
    customer_id: {type: mongoose.ObjectId, ref: 'customers', required: true }
})

const shop_customer = mongoose.model("shop_customers", shopCustomersSchema);

export default shop_customer;