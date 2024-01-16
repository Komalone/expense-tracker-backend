const User= require('../models/user');
const Expense=require('../models/expense');
const sequelize=require('../util/signUp');
const user= require('./user');
const e= require('express')

// exports.getUserLeaderBoard= async(req, res)=>{
//     try{
//     const users= await User.findAll();
//     const expenses= Expense.findAll();
//     const userAggregatedExpenses={}
//         expenses.forEach((expense)=>{
//             if(userAggregatedExpenses[expense.userId]){
//                 userAggregatedExpenses[expense.userId]=userAggregatedExpenses[expense.userId]+[expense.price]
//             }else{
//                 userAggregatedExpenses[expense.userId]=expense.price
//             }

//         })
//         console.log(userAggregatedExpenses);
//         res.status(200).json(userAggregatedExpenses)
// }catch (err){
//     console.log(err)
//     res.status(500).json(err)
// }
// }

exports.getUserLeaderBoard= async(req, res)=>{
    try{
    const leaderboardofUser= await User.findAll({
        // attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.price')), 'total_cost'] ],
        // include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        // group:['user.id'],
        order:[['totalExpense', 'DESC']]
    })
    res.status(200).json(leaderboardofUser)
}catch (err){
    console.log(err)
    res.status(500).json(err)
}
}