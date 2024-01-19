const express= require("express");
const router= express.Router();

const PasswordController= require('../controller/forgetpassword');

router.get('/forgetpassword', PasswordController.forgotpassword);

module.exports= router;