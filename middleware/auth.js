const jwt= require('jsonwebtoken');
const User= require('../models/user');

const authenticate= (req, res, next)=>{
    try{
        const token= req.header('Authorization')
        //console.log("token in auth file", token);
        const user= jwt.verify(token, 'hyt76rh4dgjtf');
        //console.log('token user', user);
        User.findByPk(user.userId).then(user =>{
            //console.log('user==', user);
            req.user= user;
            next()
        }).catch(err => {throw new Error(err)});
    }catch(err){
        console.log("auth error",err);
    }
}

module.exports= authenticate;