const bodyParser = require('body-parser')
const express=require('express')
const router=express.Router()

const path=require('path')
const Sequelize= require('sequelize')
router.use(bodyParser.urlencoded({extended:false}))
router.use(express.static(path.join(__dirname,'..','view')))

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..','view', 'expenseT.html'))
})

router.post('/user', async(req, res)=>{
    try{
        const name= req.body.name;
        const email= req.body.email;
        const password= req.body.password;

        if(email == undefined || email.length===0 || name == undefined || password == undefined){
            return res.status(400).json({message:"Bad parameter or something is missing"})
        }
        const data= await Sequelize.create({
            name, email, password
        });
        res.status(201).json({newUser : data});
    }catch(err){
        console.log(err)
    }
})

module.exports= router;