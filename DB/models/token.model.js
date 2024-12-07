import { model, Schema, Types } from "mongoose"

const tokenSchema = new Schema( {
    token: {
        type: String,
        required : true
    },
    user: {
        type: Types.ObjectId,
        ref :"User"
    },
    isValid: {
        type: Boolean,
        default : true
    },
    agent: String,
    expiredAt : String
}, { timestamps: true } )
export const Token = model("Token",tokenSchema)