export const isAuthorized = (...roles)=>{
    return (req,res,next)=>{
        // check roles
        if(!roles.includes(req.user.role)) return next(new Error("Not Authorized !! 😠"))
            return next()
    }
}