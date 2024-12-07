import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './DB/connection.js';
import authRouter from './src/modules/auth/auth.routes.js'
import categoryRouter from './src/modules/category/category.routes.js'
import productRouter from './src/modules/product/product.routes.js'

const app = express();
dotenv.config();
const port = process.env.PORT 
// parsing
app.use( express.json() );
// connect to db
await connectDB()
// CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    res.setHeader("Access-Control-Allow-Methods","*")
    res.setHeader("Access-Control-Private-Network",true)
    return next()
})
// routers
app.use('/auth',authRouter)
app.use('/category',categoryRouter)
app.use('/product',productRouter)
app.get('/',()=>{
    res.json({sucess : true ,massage:"Welcome From Server"})
})
//page not found handler
app.all( '*', ( req, res, next ) =>
{
    return next(new Error('Page Not found',{cause :404}));
})
//global error handler
app.use( ( error, req, res, next ) =>
{
    const statusCode = error.cause || 500
    res.status(statusCode).json({sucess : false ,error:error.message , stack : error.stack})

})
app.listen(port,()=>{console.log(`Servern running on ${port}`); })