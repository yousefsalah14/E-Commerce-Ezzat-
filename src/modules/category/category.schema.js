import joi from 'joi'
import { objectIdValidation } from '../../middleware/validation.middleware.js'
export const createCategory = joi.object({
    name:joi.string().min(5).max(20).required()
}).required()
export const updateCategory = joi.object({
    name:joi.string().min(5).max(20),
    id: joi.string().custom(objectIdValidation).required()
}).required()
export const deleteCategory = joi.object({
    id: joi.string().custom(objectIdValidation).required()
}).required()