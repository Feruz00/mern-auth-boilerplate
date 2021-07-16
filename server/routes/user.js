require('dotenv').config();
const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;

const token = require('../helper/token');
const ok = require('../helper/status');
const fero = require('../helper/loginli');

const nodemailer = require('nodemailer');
const Link = process.env.FRONTEND_URL + '/';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.USER_ADDRESS,
        pass: process.env.USER_PASSWORD
    }
});

const User = require('../models/user');

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser( async function(id, done) {
    await User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/users/auth/google/callback',
    // userProfileURL: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
    // passReqToCallback: true
}, function(accessToken, refreshToken, profile, done){
    

    User.findOrCreate({googleId:profile.id, username:profile.displayName}, (err,user)=>{
        return done(err,user);
    })
}
));



router.get('/auth/google', passport.authenticate('google',{ scope: ['profile'] }));

router.get('/auth/google/callback',
 passport.authenticate('google', { 
    
    successRedirect: Link,   
    failureRedirect: Link 
}) );

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/users/auth/github/callback'
}, function(accessToken, refreshToken, profile, done){
    User.findOrCreate({githubId:profile.id, username:profile.login}, (err,user)=>{
        return done(err,user);
    })
}
));

router.get('/auth/github', passport.authenticate('github',{ scope: [ 'user:email' ] }));

router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: Link,   
    failureRedirect: Link 
}) );

router.get('/auth', (req, res) => {
    if(req.isAuthenticated()){
        res.status(200).json(req.user);
    }
    else{
        return res.status(200).json({
            isAuth: false
        });
    }
});

router.get('/upd', async (req, res) => {
    const found = await User.find();

    for(let i=0;i<found.length; i++)
    await User.update({ _id: found[i].id, token: found[i].token }, { $set: { status: true } }, (err)=>{});
    res.send("ok~");
});

router.post('/register', async (req, res) => {
    const tk = token();
    await User.register( {
        email: req.body.email, 
        username: req.body.username, 
        token: tk
    }, req.body.password, (err,user)=>{
       
        if(err){
            res.status(400).json(err);
        }
        else{

            transporter.sendMail({
                from: process.env.USER_ADDRESS,
                to: req.body.email,
                subject: "Confirm Email",
                html: `<h3> Hello ${req.body.username}! </h3> Welcome to our website. Please confirm your email this <a href='${process.env.FRONTEND_URL}/activate/${user.id}/${tk}'> link </a> 3 hours `
            }, (err,data)=>{
                if(err) res.status(500).json({message: "Sorry please again!"});
                else res.status(200).json("User successfully registered! Please confirm your email");
            });     
        }
    });
});

router.patch('/verify' , async (req, res) => {
    if(req.isAuthenticated()) return res.status(400).json({message: "Only unauthencated user can in"});
    const {id, token} = req.query;

    await User.updateOne({ _id: id, token: token }, { $set: { status: true } }, (err)=>{
        if(err) return res.status(404).json(err);
        else return res.status(200).json();
    })

});
router.post('/forgot_send', async (req, res) => {
    if(req.isAuthenticated()) return res.status(400).json({message: "User must be not loginned! "});
   
    const tk = token();
    const email =req.body.email;
    await User.updateOne({email: email}, {$set: {token: tk}}, function(err, results){
        if(err) return res.status(404).json(err);
    });
    
    transporter.sendMail({
        from: process.env.USER_ADDRESS,
        to: email,
        subject: "Reset Password",
        html: `<h3> Hello! </h3>  Please click this for reset password <a href='${process.env.FRONTEND_URL}/confirm_password/${email}/${tk}'> link </a> `
    }, (err,data)=>{
        if(err) res.status(500).json({message: "Sorry please again!"});
        else res.status(200).json("User successfully registered! Please confirm your email");
    });

});
router.post('/forgot_confirm', async (req, res) => {
 	if(req.isAuthenticated()) return res.status(500).json({message: "User must be not loginned"});
    try {
        const {email, token, newPassword} = req.body;
        const found = await User.findOne( { email: email, token: token } );
        if(!found) return res.status(404).json({message: "User not found!"});
        await found.setPassword(newPassword, async function(err, user){
            if(!err) await user.save();
        } );
        // await found.save(err=>{ return res.status(403).json(err);})  ;
        return res.status(200).json({message:"Successfully updated!"});
    } catch (error) {
        return res.status(500).json({message: "Something was happy. Try again!"});
    }
});
router.get('/login_success', (req, res) => {
    return res.status(200).json(
        req.user
    );
});

router.get('/login_error', (req, res) => {
    return res.status(401).json({message:"Invalid email or password"}) 	
});


router.post("/login", ok , passport.authenticate("local"
, { successRedirect: '/api/users/login_success',
failureRedirect: '/api/users/login_error' 
}
) , function (req, res) {

});

router.get('/logout',fero, (req, res) => {
    req.logout();
    res.status(200).json({success: true});
});

module.exports = router;