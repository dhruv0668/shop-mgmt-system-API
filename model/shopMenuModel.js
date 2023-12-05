import mongoose from "mongoose";
const { Schema } = mongoose;

const shopMenuSchema = new Schema({
    menu_id: { type: mongoose.ObjectId, ref: 'menus', required: true },
    name: {type: String, trim: true},
    price: {type: Number, required:true, trim: true},
    shop_id: { type: mongoose.ObjectId, ref: 'shops', required: true },
    is_disable: {type: Boolean, default: false, trim: true}
})

const shopMenu = mongoose.model("shop_menu", shopMenuSchema);
export default shopMenu;