const Sequelize= require('sequelize');
const sequelize= require('../util/signUp');

const Expense= sequelize.define('expense', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    Itemname:{
        type:Sequelize.STRING,    
        allowNull:false,      
       
    },   
    
    price:{
        type:Sequelize.INTEGER,      
        allowNull:false,

    },
    date:{
        type:Sequelize.STRING,    
        allowNull:false, 
    },
    category:{
        type:Sequelize.STRING,   
        allowNull:false,
    } 
    
});

module.exports=Expense;