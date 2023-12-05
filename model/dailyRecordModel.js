import mongoose from "mongoose";
const { Schema } = mongoose;

const dailyRecordSchema = new Schema({
    date: { type: String, required: true, trim: true, default: Date.now() },
    time: { type: String, required: true, trim: true},
    menu_id: { type: mongoose.ObjectId, ref: 'shop_menu', required: true },
    name: { type: String, trim: true, required: true },
    quantity: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    total: { type: Number, required: true, trim: true },
    building_name: { type: String, trim: true },
    office_no: { type: String, trim: true },
    shop_id: { type: mongoose.ObjectId, ref: "shops", required: true },
    customer_id: { type: mongoose.ObjectId, ref: "customers", required: true },
    user_id: { type: mongoose.ObjectId, ref: "users", required: true },
})

const daily_record = mongoose.model("daily_record", dailyRecordSchema);
export default daily_record

