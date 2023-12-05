import mongoose from "mongoose";
const { Schema } = mongoose;

const tokensSchema = new Schema({
    user_id : { type: mongoose.ObjectId, ref: 'users', required: true },
    token : {type: String, required: true},
})

const tokens = mongoose.model("tokens", tokensSchema)

export default tokens
