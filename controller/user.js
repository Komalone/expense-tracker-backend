const User= require('../models/user');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');


const isStringInvalid=(string)=>{
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

const signUp=async(req, res)=>{
    try{
        const name= req.body.name;
        const email= req.body.email;
        const password= req.body.password;

        if(isStringInvalid(email) || isStringInvalid(password) || isStringInvalid(name)){
            res.status(400).json({message: "All details not entered", success: false})
        }
        
        let saltrounds=10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            const data= await User.create({
                name, email, password:hash
           });
           res.status(201).json({ message: "user register"});
        })
        
    }catch(err){
        console.log(err)
    }
}

const generateToken=(id, name, ispremiumuser)=>{
    return jwt.sign({userId: id, name: name, ispremiumuser}, 'hyt76rh4dgjtf')
} 

const login= async(req, res)=>{
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
                    return res.status(200).json({
                        success: true, 
                        message: "User logged in", 
                        token: generateToken(user[0].id, user[0].name, user[0].ispremiumuser)
                    })
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
module.exports={generateToken: generateToken, signUp: signUp, login: login}