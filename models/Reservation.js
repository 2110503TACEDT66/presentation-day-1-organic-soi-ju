const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    
    reserveDate: {
        type: Date,
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    massage_shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'MassageShop',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

module.exports = mongoose.model('Reservation', ReservationSchema);