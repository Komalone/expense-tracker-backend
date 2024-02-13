const express=require('express');

const auth= require('../middleware/auth');
const premiumController= require('../controller/premium');

const router= express.Router();

router.get('/showLeaderboard', auth, premiumController.getUserLeaderBoard );

module.exports= router;