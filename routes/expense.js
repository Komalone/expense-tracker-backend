const express=require('express')
const router=express.Router();
const bodyParser = require('body-parser')
const path=require('path')

const userAuth= require('../middleware/auth');
const expController=require('../controller/expense');

router.use(express.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(express.static(path.join(__dirname,'..','view')))
router.use(express.static(path.join(__dirname, '..' ,'public')));

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..','view', 'navbar.html'))
})

router.post('/user/add-expense', userAuth, expController.postExpense);
router.get('/user/all-expense',userAuth, expController.getExpense);
router.delete('/user/delete-exp/:id', userAuth, expController.deleteExpense);

router.get('user/detailed-report', userAuth, (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'pagination.html'));
})

router.get('/download', userAuth, expController.downloadExp)

module.exports=router;