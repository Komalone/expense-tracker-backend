const Sequelize= require('sequelize');

const sequelize= new Sequelize('expense-tracker', 'root', 'Kom@l111', {
    dialect: 'mysql',
    host: 'localhost'
});
sequelize.authenticate()
.then(()=> {
    console.log('Successfully authenticate')
}).catch(err=> console.log(err));

module.exports= sequelize;