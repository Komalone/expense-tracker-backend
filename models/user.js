const Sequelize= require('sequelize');
const sequelize=require('../util/signUp');

const User= sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports= User;