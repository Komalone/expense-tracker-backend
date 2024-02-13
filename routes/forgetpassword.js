const express= require("express");
const router= express.Router();

const PasswordController= require('../controller/forgetpassword');

router.use('/forgetpassword', PasswordController.forgotpassword);

router.get('/resetpassword/:id', PasswordController.resetPasword);

router.get('/updatepassword/:resetpasswordid:', PasswordController.updatePassword)

module.exports= router;