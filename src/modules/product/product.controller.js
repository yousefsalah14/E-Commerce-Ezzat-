import {nanoid} from "nanoid";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";
export const createProduct = asyncHandler(async (req, res, next) => {
  // category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  //check files
  if (!req.files)
    return next(new Error(" product images are required!! ", { cause: 400 }));
  //check folder name
  const cloudFolder = nanoid();
  // upload sub images
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  );
  // create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage : {id : public_id , url : secure_url},
    images,
  })
  return res.json({ success: true, message: "product created successfully " });
});



export const updateProduct = asyncHandler(async (req, res, next) => {
  // Find the product in the database
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  // Check if the user is the owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new Error("You are not the owner 😠"));

  // Check if category exists (optional, if category change is allowed)
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) return next(new Error("Category not found", { cause: 404 }));
    product.category = req.body.category;
  }

  // Update product details
  if (req.body.name) {
    product.name = req.body.name;
  }

  if (req.body.description) product.description = req.body.description;

  // Handle file updates
  if (req.files) {
    const cloudFolder = product.cloudFolder || nanoid(); // Use existing or create a new folder

    // Update sub-images if provided
    if (req.files.subImages) {
      let updatedImages = [];
      const subImages = Array.isArray(req.files.subImages)
        ? req.files.subImages
        : [req.files.subImages];

      for (const file of subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
        );
        updatedImages.push({ id: public_id, url: secure_url });
      }
      product.images = updatedImages;
    }

    // Update default image if provided
    if (req.files.defaultImage) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.defaultImage[0].path,
        {
          public_id: product.defaultImage.id, // Update existing image
          folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
        }
      );
      product.defaultImage = { id: public_id, url: secure_url };
    }
  }

  // Save the updated product
  await product.save();

  // Send response
  return res.json({
    success: true,
    message: "Product updated successfully ✅",
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
    // check product 
    const product = await Product.findById(req.params.id)
    if(!product) return next(new Error("Product not found ", { cause:404 }));
    // check owner 
    if(req.user._id.toString()!==product.createdBy.toString()) 
        return next(new Error(" Not Allowed to delete this product  ", { cause:401}));
    // delete product 
    await product.deleteOne()
    // delete images
    const ids = product.images.map((image)=>image.id)
    ids.push(product.defaultImage.id)
    await cloudinary.api.delete_resources(ids)
    // delete folder
    await cloudinary.api.delete_folder(
        `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
    )
    return res.json({ success: true, message: "product deleted Succssfully " });
});
export const allFilterProducts = asyncHandler(async (req, res, next) => {
  let { keyword, sort, page, ...filters } = req.query; // Extract filters dynamically

  // If no query parameters exist
  if (!keyword && !sort && !page && Object.keys(filters).length === 0) {
    return next(new Error("Products not found", { cause: 404 }));
  }

  let query = {}; // Build the query object dynamically

  // Search by keyword
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }

  // Include other filters from `req.query`
  query = { ...query, ...filters };

  // Pagination setup
  page = page < 1 || isNaN(page) || !page ? 1 : parseInt(page, 10);
  const limit = 25; // Set the desired limit per page
  const skip = limit * (page - 1);

  // Get total count of matching products
  const totalProducts = await Product.countDocuments(query);

  // Execute the query with optional sorting, skipping, and limiting
  const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

  // If no products are found
  if (products.length === 0) {
    return next(new Error("Products not found", { cause: 404 }));
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);

  return res.json({
    success: true,
    meta: {
      pagination: {
        page,
        pageSize: products.length,
        totalPages,
       totalProducts,
      },
    },
    data: products,
  });
});



export const allProducts = asyncHandler(async (req, res, next) => {
  // Apply filters if any
    const products = await Product.find();
    if (products.length === 0)
      return next(new Error("Products not found", { cause: 404 }))
    return res.json({ success: true, products })
});
