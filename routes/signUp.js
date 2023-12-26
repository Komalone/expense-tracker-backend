const bodyParser = require('body-parser')
const express=require('express')
const router=express.Router()

const path=require('path')
const controllerUser= require('../controller/user')

router.use(bodyParser.urlencoded({extended:false}))
router.use(express.static(path.join(__dirname,'..','view')))

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..','view', 'expenseT.html'))
})

router.post('/user', controllerUser.signUp);

router.post('/user', controllerUser.login);

module.exports= router;