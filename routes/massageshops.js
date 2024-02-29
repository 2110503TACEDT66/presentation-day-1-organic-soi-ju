const express = require('express');
const {getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop} = require('../controllers/massageshops');
const {protect, authorize} = require('../middleware/auth');

const reservationRouter = require('./reservations');

const router = express.Router();
// controllers method here blah blah

router.use('/:massageshopId/reservations', reservationRouter);

router.route('/')
    .get(getMassageShops) // this might not require protection nor authorization
    .post(protect, authorize('admin'), createMassageShop); // for admin only

router.route('/:id')
    .get(getMassageShop) // this might not require protection nor authorization
    .put(protect, authorize('admin'),updateMassageShop) // for admin only
    .delete(protect, authorize('admin') , deleteMassageShop); // for admin only

module.exports = router;