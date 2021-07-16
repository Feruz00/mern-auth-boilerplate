const User = require("../models/user");

const ok = async ( req,res,next )=>{
    try {

        let found;
        if(req.body.email) found = await User.findOne({ email: req.body.email });
        else found = await User.findOne({ username: req.body.username });
        if(!found) return res.status(404).json( { message: "Email not found!"} );
        if( found.status === false ) return res.status(400).json({message: "Please confirm your email!"});
        if(found.status===true){
            return next();
        }
        const dt = found.createdAt;
        const now = new Date();

        if( dt.getTime() + 3*60*60*1000 - now.getTime() < 0 ) return res.status(400).json({message: "You can't confirm email. Try another email for register!"});


        next();


    } catch (error) {
        return res.status(500).json({message: "Please try again!"});
    }
}

module.exports = ok;