const User= require('../models/user');
const bcrypt= require('bcrypt');

const isStringInvalid=(string)=>{
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

exports.signUp=async(req, res)=>{
    try{
        const name= req.body.name;
        const email= req.body.email;
        const password= req.body.password;

        if(email == undefined || email.length===0 || name == undefined || password == undefined){
            return res.status(400).json({message:"Bad parameter or something is missing"})
        }
        
        let saltrounds=10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            const data= await User.create({
                name, email, password:hash
           });
           res.status(201).json({newUser : data, "message": "user register"});
        })
        
    }catch(err){
        console.log(err)
    }
}

exports.login= async(req, res)=>{
    try{
        const { email, password}=req.body;
        if(isStringInvalid(email) || isStringInvalid(password)){
            res.status(400).json({message: "Either email or password is not correct", success: false})
        }
        console.log(password);
        const user=await User.findAll({where : {email}})
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result)=>{
                if(err){
                    throw new Error('something went wrong')
                }
                if(result === true){
                    return res.status(200).json({success: true, message: "User logged in"})
                }
                else{
                    return res.status(400).json({success: false, message: "password is incorrect"})
                }
            })
        }else{
            return res.status(404).json({success: false, message: "user doesnt exist"})
        }

    }catch(err){
        console.log("error in login ",err);
        res.status(500).json({error : err, success: false })
    }
}