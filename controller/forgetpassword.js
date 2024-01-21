const uuid= require('uuid');
const sgMail= require('@sendgrid/mail');
const bcrypt= require('bcrypt');

const User=require('../models/user');
const Forgotpassword= require('../models/forgetpassword');

exports.forgotpassword= async (req, res)=>{
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'testingSendGrid@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
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