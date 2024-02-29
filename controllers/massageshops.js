const MassageShop = require('../models/MassageShop');

//@desc     Get all massageshops
//@route    GET /api/v1/massageShops
//@access   Public
exports.getMassageShops = async (req,res,next) => {
    
    // query, select, sort, pagination
    let query;

    const reqQuery = {...req.query};

    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = MassageShop.find(JSON.parse(queryStr)).populate('reservations');

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }
    else {
        query = query.sort('name');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await MassageShop.countDocuments();

    query = query.skip(startIndex).limit(limit);
    try{
        const shops = await query;
        console.log(req.qeury);

        if(endIndex < total) {
            pagination.next = {
                page: page + 1, 
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

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
        const shop = await MassageShop.findById(req.params.id);

        if(!shop){
            res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: shop});
    }catch(err){
        res.status(400).json({success: false})
    }

};

//@desc     Create massageshops
//@route    POST /api/v1/massageShops
//@access   Private
exports.createMassageShop = async (req,res,next) => {
    const shop = await MassageShop.create(req.body);
    res.status(201).json({success: true, data: shop});
};

//@desc     Update all massageshops
//@route    PUT /api/v1/massageShops/:id
//@access   Private
exports.updateMassageShop = async (req,res,next) => {
    try{
        const shop = await MassageShop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!shop){
            return res.status(400).json({success: false});
        }

        res.status(200).json({success: true, data: shop});
    }catch(err){
        res.status(400).json({success: false});
    }
};

//@desc     Delete all massageshops
//@route    GET /api/v1/massageShops
//@access   Private
exports.deleteMassageShop = async (req,res,next) => {
    try{
        const shop = await MassageShop.findById(req.params.id);

        if(!shop){
            return res.status(400).json({success: false});
        }

        await shop.deleteOne(); // triggers the cascading deletion of reservations.

        res.status(200).json({success: true, data: {}});
    }catch(err){
        res.status(400).json({success: false});
    }
};