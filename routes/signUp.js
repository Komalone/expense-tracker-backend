const bodyParser = require('body-parser')
const express=require('express')
const router=express.Router()

const path=require('path')
const User= require('../models/user')
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
        const data= await User.create({
             name, email, password
        });
        res.status(201).json({newUser : data, "message": "user register"});
    }catch(err){
        console.log(err)
    }
})

router.get('/user', async(req, res)=>{
    try{
        const allUser= User.findAll()
        let success= false;
        allUser.forEach(user => {
            if(newUser.email === user.email && newUser.password === user.password){
                success= true;
            }
        });
        if(success){
            console.log('success');
            res.send('success');
        }else{
            res.redirect('/')
        }
    }catch(err){
        console.log("error in login ",err);
        res.status(500).json({error : err })
    }
})

module.exports= router;