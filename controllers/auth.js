const { json } = require('express');
const User = require('../models/User');

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
        res.status(200).json({success: true})

    }catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
}