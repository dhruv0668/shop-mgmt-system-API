import mongoose from "mongoose";
const { Schema } = mongoose;

const menuSchema = new Schema ({
    name: { type: String, required: true, trim: true }
})

const menu = mongoose.model("menu", menuSchema);
export default menu;

