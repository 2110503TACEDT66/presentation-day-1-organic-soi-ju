const massageShop = require('../models/MassageShop');

//@desc     Get all massageshops
//@route    GET /api/v1/massageShops
//@access   Public
exports.getMassageShops = async (req,res,next) => {
    try{
        const shops = await massageShop.find();

        res.status(200).json({success: true, count: shops.length, data: shops});
    }catch(err){
        res.status(400).json({success: false});
    }
};

//@desc     Get single massageshops
//@route    GET /api/v1/massageShops/:id
//@access   Public
exports.getMassageShop = async (req,res,next) => {
    try{
        const shops = await massageShop.findById(req.params.id);

        if(!shops){
            res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: shops});
    }catch(err){
        res.status(400).json({success: false})
    }

};

//@desc     Create massageshops
//@route    POST /api/v1/massageShops
//@access   Private
exports.createMassageShop = async (req,res,next) => {
    const shops = await massageShop.create(req.body);
    res.status(201).json({success: true, data: shops});
};

//@desc     Update all massageshops
//@route    PUT /api/v1/massageShops/:id
//@access   Private
exports.updateMassageShop = async (req,res,next) => {
    try{
        const shops = await massageShop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!shops){
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: shops});
    }catch(err){
        res.status(400).json({success: false});
    }
};

//@desc     Delete all massageshops
//@route    GET /api/v1/massageShops
//@access   Private
exports.deleteMassageShop = async (req,res,next) => {
    try{
        const shops = await massageShop.findByIdAndDelete(req.params.id);

        if(!shops){
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: {}});
    }catch(err){
        res.status(400).json({success: false});
    }
};