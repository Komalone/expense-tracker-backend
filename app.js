const express= require('express');
const path= require('path');
const bodyParser= require('body-parser');
const app= express();
const cors= require('cors');
const sequelize= require('./util/signUp')

const routeSignUp= require('./routes/signUp');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json())

app.use('/', routeSignUp);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err => console.log(err));
