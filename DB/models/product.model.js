
import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 20,
      required: true,
    },
    description: {
      type: String,
      min: 10,
      max: 200,
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    avaliableItems: {
      type: Number,
      required: true,
      min: 1,
    },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:Types.ObjectId,
        ref:"Category",
        required:true
    },
    cloudFolder:{
        type:String,
        unique:true,
        required:true
    }
  },
  { timestamps: true , strictQuery : true ,toJSON:{virtuals:true} ,toObject:{virtuals:true} }
);
// virtuals
productSchema.virtual("finalPrice").get(function(){
    return Number.parseFloat(this.price - (this.price * this.discount || 0)/100).toFixed(2)

})
productSchema.query.paginate = function(page){
  page = page < 1 || isNaN(page) || !page  ? page = 1 : page
  const limit = 10
  const skip = limit * (page-1)
  return this.skip(skip).limit(limit)
}
productSchema.query.search = function(keyword){
  if(keyword){
    return this.find({name :{$regex : keyword ,$options:"i"}})
  }
}
// methods
productSchema.methods.inStock = function(quantity){
  return this.avaliableItems >=  quantity ? true  : false
}
export const Product = model("Product", productSchema);
