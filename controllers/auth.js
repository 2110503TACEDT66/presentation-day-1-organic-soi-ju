// const { json } = require('express');
const User = require('../models/User');


const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken(); 
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // in milliseconds
        httpOnly: true
    };
    
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};



//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    try{
        const {name, email, password, role, tel} = req.body;

        //Create User
        const user = await User.create({
            name,
            email,
            password,
            role,
            tel
        })
        // res.status(200).json({success: true})
        sendTokenResponse(user, 200, res);

    }catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
}

exports.login = async (req, res, next) => {

    try{
    const {email, password} = req.body;

    // Validate email & password
    if(!email || !password){
        return res.status(400).json({success: false, error: 'Please provide an email and password'});
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');
    

    if(!user){
        return res.status(401).json({success: false, error: 'Invalid credentials'});
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({success: false, error: 'Invalid credentials'});
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);

    } catch (err) {
        console.log(err.stack);

        res.status(401).json({success: false, msg: 'Cannot convert email or password to string'});
    }

};

exports.logout = async (req, res, next) => {
    res.cookie('token','none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({success: true, data: {}});

};

// accesory middleware.


exports.getMe = async (req, res, next) => {
    
    let query = User.findById(req.user.id).populate('reservations');
    const user = await query;
    res.status(200).json({success: true, data: user});
};

exports.getUsers = async (req, res, next) => {
    
    let query;
    query = User.find().populate('reservations');
    try {
        const users = await query;
        res.status(200).json({success: true, count: users.length, data: users});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false});
    }
    

};