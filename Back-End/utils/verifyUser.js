const jwt=require("jsonwebtoken");
const errorHandler = require("./error");
const verifyUser=async(req,res,next)=>
{
    const token=req.cookies.access_token;
   
    if(!token)
    {
        return next(errorHandler(401,"Unauthorized token provided"))
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>
    {
        if(err)
        {
            console.log(err)
            return next(errorHandler(401,"forbiden error"))
        }
        req.user=user;
        next()
    })

}
module.exports=verifyUser;