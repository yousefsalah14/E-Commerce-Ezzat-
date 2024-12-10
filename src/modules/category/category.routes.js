import { Router } from 'express' 
import { isAuthenicated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js'
import { fileUpload } from '../../utils/fileUpload.js'
import { validation } from '../../middleware/validation.middleware.js'
import * as categoryController from './category.controller.js'
import * as categorySchema from './category.schema.js'
const router = Router()

// create 
router.post('/',
    isAuthenicated,
    isAuthorized('admin'),
    fileUpload().single("category"),
    validation(categorySchema.createCategory),
    categoryController.createCategory
)
// update 
router.patch('/:id',
    isAuthenicated,
    isAuthorized('admin'),
    fileUpload().single("category"),
    validation(categorySchema.updateCategory),
    categoryController.updateCategory
)
// delete 
router.delete('/:id',
    isAuthenicated,
    isAuthorized('admin'),
    validation(categorySchema.deleteCategory),
    categoryController.deleteCategory
)
// getOneCategory 
router.get('/:id',
    categoryController.getOneCategory
)
// get all 
router.get('/',
    categoryController.getCategories
)





export default router 