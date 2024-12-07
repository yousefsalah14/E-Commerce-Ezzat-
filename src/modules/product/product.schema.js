import joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const createProduct = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string().min(10).max(200).required(),
    avaliableItems: joi
      .number()
      .integer()
      .min(1)
      .required(),
      price :joi
      .number()
      .integer()
      .min(1)
      .required(),
      category : joi.string().custom(objectIdValidation).required(),
    
  })
  .required();
export const updateProduct = joi
  .object({
    id: joi.string().custom(objectIdValidation).required(),
    name: joi.string().min(2).max(20),
    description: joi.string().min(10).max(200),
    avaliableItems: joi
      .number()
      .integer()
      .min(1)
      ,
      price :joi
      .number()
      .integer()
      .min(1)
      ,
      category : joi.string().custom(objectIdValidation),
    
  })
  .required();

  export const deleteProduct = joi.object({
      id: joi.string().custom(objectIdValidation).required()
  }).required();