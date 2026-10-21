const errorHandler=(err,req,res,next)=>{console.error(err);const status=err.statusCode||500;res.status(status).json({message:err.message||'Server error'});};
const asyncHandler=(fn)=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
module.exports={errorHandler,asyncHandler};
