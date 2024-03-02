const MassageShop = require('../models/MassageShop');
const Reservation = require('../models/Reservation');

exports.getReservations = async (req, res, next) => {
    let query;

    if(req.user.role != 'admin') {
        query = Reservation.find({user: req.user.id}).populate({
            path: 'massage_shop',
            select: 'name province tel'
        });
    }
    else {
        if (req.params.massageshopId) {
            console.log(req.params.massageshopId);
            query = Reservation.find({massage_shop: req.params.massageshopId}).populate({
                path: 'massage_shop',
                select: 'name province tel'
            });
        }
        else {
            query = Reservation.find().populate({
                path: 'massage_shop',
                select: 'name province tel'
            });
        }
    }

    try {
        const reservations = await query;
        res.status(200).json({success: true, count: reservations.count, data: reservations});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'massage_shop',
            select: 'name province tel'
        });

        if(!reservation) {
            return res.status(404).json({success: false, message: `Reservation with id: ${req.params.id} is not found`});
        }
        if(reservation.user.toString() != req.user.id && req.user.role != 'admin'){
            return res.status(401).json({success: false, message: `User with id: ${req.user.id} is not authorized to view this reservation`});
        }

        res.status(200).json({success: true, data: reservation});

    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
};

exports.addReservation = async (req, res, next) => {
    try {

        req.body.massage_shop = req.params.massageshopId;
        req.body.user = req.user.id;

        const existedReservations = await Reservation.find({user: req.user.id});

        const massageShop = await MassageShop.findById(req.params.massageshopId);

        if(existedReservations.length >= 3 && req.user.role != 'admin') {
            return res.status(400).json({success: false, message: `User with id: ${req.user.id} has already made 3 reservations`});
        }
        if(!massageShop) {
            return res.status(404).json({success: false, message: `Massage Shop with id: ${req.params.massageshopId} is not found`});
        }

        const reservation = await Reservation.create(req.body);
        res.status(201).json({success: true, data: reservation});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
};

exports.updateReservation = async (req, res, next) => {
    try {
        
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            return res.status(404).json({success: false, message: `Reservation with id: ${req.params.id} is not found`});
        }
        if(reservation.user.toString() != req.user.id && req.user.role != 'admin'){
            return res.status(401).json({success: false, message: `User with id: ${req.user.id} is not authorized to update this reservation`});
        }
        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, data: reservation});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
};

exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            return res.status(404).json({success: false, message: `Reservation with id: ${req.params.id} is not found`});
        }
        if(reservation.user.toString() != req.user.id && req.user.role != 'admin'){
            return res.status(401).json({success: false, message: `User with id: ${req.user.id} is not authorized to delete this reservation`});
        }

        await reservation.deleteOne();
        res.status(200).json({success: true, data: {}});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
};