const express= require('express');
const path= require('path');
const bodyParser= require('body-parser');
const app= express();
const cors= require('cors');
const dotenv= require('dotenv')
const sequelize= require('./util/signUp')

const routeSignUp= require('./routes/signUp');
const expenseRoute= require('./routes/expense');
const purchaseRoute= require('./routes/purchase');
const premiumRoute= require('./routes/premium');
const passwordRoute= require('./routes/forgetpassword')

const Expense=require('./models/expense');
const User=require('./models/user');
const Order= require('./models/orders');
const ForgotPassword= require('./models/forgetpassword');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '..','view'))); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json())
dotenv.config();

app.use(expenseRoute);
app.use('/user', routeSignUp);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);
//app.use('/', expenseRoute)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

sequelize.sync({alter: true})
.then(()=>{
    app.listen(3000);
})
.catch(err => console.log(err));
