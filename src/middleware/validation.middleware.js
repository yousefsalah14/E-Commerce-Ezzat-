import { Types } from "mongoose"

export const objectIdValidation = (value , helper) =>
    {
        if ( Types.ObjectId.isValid( value ) ) return true
        return helper.message("invalid object id")
    }
    
export const validation = ( schema ) =>
{
    return ( req, res, next ) =>
    {
        const data = {...req.body,...req.params,...req.query}
        const validationResult = schema.validate(data, { abortEarly: false } )
        if ( validationResult.error ) {
            const errorMessages = validationResult.error.details.map( ( obj ) =>
            {
                return obj.message
            } )
            return next( new Error( errorMessages ) )
        }
        return next()
    }
}
