
const fero = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({message: "User must be loginned"});
    }
    return next();
}
module.exports = fero;