import { model, Schema } from "mongoose";
import bcryptjs from 'bcryptjs'

const userSchema = new Schema( {
    userName: {
        type: String,
        required :true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password: {
        type: String,
        required :true
    },

    phone: {
        type: String
    },
    role:{
        type : String ,
        enum : ["user","admin"],
        default : "user"
    },
   
    forgetCode: String,
    profileImg: {
        url: {
            type: String,
            default :"https://res.cloudinary.com/diercfqyc/image/upload/v1722820582/E-commerce/users/defaults/profile/default-profile-account_coekpm.jpg"
        } ,
        id: {
            type: String,
            default : "E-commerce/users/defaults/profile/default-profile-account_coekpm"
        },
    }
    
}, { timestamps: true } )

// hash password hook
userSchema.pre("save",function(){
if(this.isModified("password")){
    this.password = bcryptjs.hashSync(
        this.password,
        parseInt(process.env.SALT_ROUND))
}
})
export const User = model("User",userSchema)