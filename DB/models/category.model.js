import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required :true ,
        unique:true,
        min:5 , max: 20
    },
    slug:{
        type:String,
        required :true ,
        unique:true,
    },
    image : {
        id :{type:String},
        url:{type:String}
    },
    createdBy : {
        type : Types.ObjectId ,
        ref: "User",
        required : true
    }
},{timestamps:true, toJSON:{virtuals : true},toObject:{virtuals : true}})


// how to use it
// make toJson in schema --> {virtuals : true} to display in response as json object
// toObject:{virtuals : true} to display in code and cmd and console

export const  Category = model("Category",categorySchema)