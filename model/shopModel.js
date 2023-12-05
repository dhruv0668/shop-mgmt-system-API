import mongoose from "mongoose";

const { Schema } = mongoose;

const shopSchema = new Schema({
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true  },
    address: { type: String, required: true, trim: true },
    user_id: { type: mongoose.ObjectId, ref: 'users', required: true }
}, { timestamps: true });

const shopData = mongoose.model("shops", shopSchema)
export default shopData
