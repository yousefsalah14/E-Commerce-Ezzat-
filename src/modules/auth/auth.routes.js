import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as authSchema from './auth.schema.js'
import * as authController from './auth.controller.js'
const router = Router();
router.post('/signup',validation(authSchema.signUp),authController.signUp)
router.post('/signin',validation(authSchema.signIn),authController.signIn)
router.patch( '/forgetCode', validation( authSchema.forgertCode ), authController.forgertCode )
router.patch('/resetPassword',validation(authSchema.resetPassword),authController.resetPassword)

export default router;