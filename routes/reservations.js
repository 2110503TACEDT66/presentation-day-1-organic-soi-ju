const express = require('express');

const {getReservations, getReservation, addReservation, updateReservation, deleteReservation} = require('../controllers/reservations');

const router = express.Router({mergeParams: true});

// require protect, authorize

router.route('/').get(getReservations).post(addReservation);
router.route('/:id').get(getReservation).put(updateReservation).delete(deleteReservation);

module.exports = router;