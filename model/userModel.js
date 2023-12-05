import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true  },
    password: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    role: { type: Number, default: 0, trim: true },
    is_admin: { type: Number, default: 0, trim: true }
});

var Blog = mongoose.model('users', userSchema);
export default Blog

