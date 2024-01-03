const express=require('express')
const router=express.Router();
const bodyParser = require('body-parser')
const path=require('path')

const Expense= require('../models/expense');


router.use(express.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(express.static(path.join(__dirname,'..','view')))
router.use(express.static(path.join(__dirname, '..' ,'public')));

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..','view', 'navbar.html'))
})

router.post('/user/add-expense', );
router.get('/user/all-expense', );
router.delete('/user/delete-exp/:id');

module.exports=router;