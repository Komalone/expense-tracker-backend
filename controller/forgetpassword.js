const uuid= require('uuid');
const bcrypt= require('bcrypt');
const nodeMailer= require('nodemailer')

const User=require('../models/user');
const Forgotpassword= require('../models/forgetpassword');

exports.forgotpassword= async (req, res)=>{
    try {
        const { email } =  req.body;
        if(!email){
            return res.status(401).json({message : "Email is required", success: false})
        }
        const user = await User.findOne({where : { email }});
        if(!user){
            return res.status(404).json({ message : "User not found", success: false})
        }

        const id= uuid.v4();

        const forgetPwdEntry= await Forgotpassword.create({
            id, 
            active:true,
            userId: user.id
        });

        const transportor= nodeMailer.createTransport({
            host:"smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth:{
                user: 'komal111coco@gmail.com',
                pass: 'IyAJCFHwg7Rx4srW'
            }
        });

        const mailoption= {
            from: email,
            to: 'komal111coco@gmail.com',
            subject: 'Please reset the password',
            text: 'easy to reset with help of nodemailer and brevo',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
        };

        transportor.sendMail(mailoption, (error, info) =>{
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error sending email', success: false });
            }
            return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
       
        })
        
    } catch(err){
        console.error(err)
        return res.status(500).json({ message: err, sucess: false });
    }
}

exports.resetPasword= (req, res)=>{
    const id= req.params.id;
    Forgotpassword.findOne({where : {id}})
    .then(forgetpwdrequest =>{
        if(forgetpwdrequest){
            forgetpwdrequest.update({active: false});

            res.status(200)
            .send(`<html>
                    <script>
                        function formSubmitted(e){
                            e.preventDefault();
                            console.log('called')
                        }
                    </script>
                    <form action='/password/updatepassword/${id}' method='get'>
                        <label for='newpwd'>Enter New Password</label>
                        <input name="newpwd" type='password' required></input>
                        <button>Reset password</button>
                    </form>
                    </html>`)
            res.end()
        }
    })
}

exports.updatePassword=(req, res)=>{
    try{
        const { newpwd }= req.query;
        const { resetpwdId}= req.params;
        Forgotpassword.findOne({where: {id: resetpwdId}}).then(resetpwdrequest =>{
            User.findOne({where: {id: resetpwdrequest.userId}}).then(user=>{
                if(user){
                    const saltrounds= 10;
                    bcrypt.genSalt(saltrounds, function(err, salt){
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpwd, salt, function(err, hash){
                            if(err){
                            console.log(err);
                            throw new Error(err);
                            }
                            user.update({password: hash}).then(()=>{
                                res.status(201).json({message: "Successfully Update new Password"})
                            })
                        });
                    })
                }else{
                    return res.status(404).json({error: 'No user Exists', success: false})
                }
            })
        })
    }catch(err){
        return res.status(403).json({err, success: false})
    }
}