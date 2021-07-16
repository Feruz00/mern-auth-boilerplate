require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');

const http = require('http');
const router = require('./routes/user');

const app = express();

mongoose.connect(
process.env.MONGO_URL
    , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users',router);

const server = http.createServer(app);


const PORT = process.env.PORT || 3001;
server.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}`);
});