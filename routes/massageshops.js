const express = require('express');
const {getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop} = require('../controllers/massagesshop');

const router = express.Router();
// controllers method here blah blah

router.route('/').get(getMassageShops).post(createMassageShop);
router.route('/:id').get(getMassageShop).put(updateMassageShop).delete(deleteMassageShop);

module.exports = router;