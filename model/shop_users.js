import mongoose from "mongoose";

const { Schema } = mongoose;

const shopUserSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    shop_id :{ type: mongoose.ObjectId, ref: 'shops', required: true },
    is_disable: {type: Boolean, default: false, trim: true}
});

const shop_users = mongoose.model("shop_users", shopUserSchema)
export default shop_users