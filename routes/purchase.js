const express=require('express');

const auth= require('../middleware/auth');
const controller= require('../controller/purchase');
const router= express.Router();

router.get('/premium-membership', auth, controller.purchasePremium);

router.post('/update-transaction-status', auth, controller.updateTransactionStatus );

module.exports= router;