import mongoose from "mongoose";
const {Schema} = mongoose

const customerSchema = new Schema({
    name: { type: String, required: true, trim: true  },
    building_name: { type: String, required: true, trim: true  },
    office_no: { type: String, required: true, trim: true  },
    address: { type: String, required: true, trim: true  },
    contact: { type: String, required: true, trim: true  },
    shop_id: { type: mongoose.ObjectId, ref: 'shops', required: true },
    is_disable: {type: Boolean, default: false, trim: true}
}, {timestamps:true})

const customers = mongoose.model("customers", customerSchema)
export default customers
