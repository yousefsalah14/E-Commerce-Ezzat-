import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createCategory = asyncHandler(async (req, res, next) => {
     
    //check file
    if(!req.file) return next(new Error("Category image is required 😠", { cause:400}));
    const {public_id,secure_url}= await cloudinary.uploader.upload(
        req.file.path,{
            folder : `${process.env.CLOUD_FOLDER_NAME}/category`
        }
    )
    // save category in db
    await Category.create({
        name:req.body.name,
        createdBy: req.user._id,
        slug:slugify(req.body.name),
        image:{id:public_id,url:secure_url}
    })
    return res.json({ success: true, message: "Category Created Successfully✅" });
});
export const updateCategory = asyncHandler(async (req, res, next) => {
    // check category in db
    const category = await Category.findById(req.params.id)
    if(!category)return next(new Error("category not found", { cause: 404 }));
    // check owner
    if(req.user._id.toString() !== category.createdBy.toString())
        return next(new Error("you not the owner 😠"));
    
    // check file
    if(req.file){
        const {public_id ,secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {public_id:category.image.id}
        )
        category.image = {id :public_id , url : secure_url }
        category.name = req.body.name ? req.body.name : category.name
        category.slug = req.body.name ? slugify(req.body.name) : category.slug
    // Save the updated category
    await category.save();
    // Send response
    return res.json({ success: true, message: "Category updated successfully ✅" });
    }
});
export const deleteCategory = asyncHandler(async (req, res, next) => {
    // check category in db and delete it
    const category = await Category.findById(req.params.id)
    if(!category)return next(new Error("category not found", { cause: 404 }));
    // check owner 
    if(category.createdBy.toString()!== req.user.id)
        return next(new Error("Not Allowed To delete Category ", { cause:401 }));
    // delete category
    await category.deleteOne({_id:req.params.id})
    // delete it from cloudinary
    await cloudinary.uploader.destroy(category.image.id)
    // send res
    res.json({ success: true, message: "category deleted successfully ✅" });
});
export const getCategories =asyncHandler(async (req, res, next) => {
    const categories = await Category.find()
    res.json({ success: true, categories });
});