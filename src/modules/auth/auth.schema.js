
import joi from "joi";
// sign up
export const signUp = joi.object( {
    userName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
} ).required()

// sign in
export const signIn = joi.object( {
    email: joi.string().email().required(),
    password:joi.string().required()
} ).required()
// forget code 
export const forgertCode = joi.object( {
    email: joi.string().email().required()
} ).required()
// reset password
export const resetPassword = joi.object( {
    email: joi.string().email().required(),
    forgetCode:joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword :joi.string().valid( joi.ref( "password" ) ).required()
} ).required()

