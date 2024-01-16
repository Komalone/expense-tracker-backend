const Expense= require('../models/expense');
const User= require('../models/user');
const sequelize= require('../util/signUp');

exports.postExpense= async(req, res)=>{
    console.log('id', req.user)
    try{
      const t= await sequelize.transaction();
      const name = req.body.name;
      const price = req.body.price;
      const date=  req.body.date;
      const category = req.body.category;
     
      
      const data = await Expense.create({
        Itemname: name,
        price: price,
        date:date,
        category: category,
        userId:req.user.id
       },
       {transaction: t
      });
      const totalExpense= Number(req.user.totalExpenses)+Number(price)
      console.log("totalExpenses", totalExpense)  
      User.update({totalExpenses: totalExpense}, {where:{id: req.user.id}, transaction: t})
      await t.commit()   
      res.status(201).json({ newexpenseDetail: data ,Expense : totalExpense });
    }catch(err){
        console.log("post expense err", err)
        await t.rollback()
        res.status(500).json({error:err})
    }
}

exports.getExpense=async(req,res)=>{
    try{
    const expenses=await Expense.findAll({where:{userId:req.user.id}});
    console.log(req.user.id)
    res.status(200).json({allExpenses:expenses});
    }catch(err){
        console.log('get user is failing', JSON.stringify(err))
        res.status(500).json({error:err })
    }
}

exports.deleteExpense=async(req,res)=>{
    try{
      const uId=req.params.id
        if(uId=='undefined'|| uId.length === 0){
            console.log('ID is missing')
            return res.status(400).json({success: false, })
        }
    ;
   const noofrows= await Expense.destroy({where:{id:uId,userId:req.user.id}})
   console.log("noofrows",noofrows)
   if(noofrows === 0){     
    return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
}
return res.status(200).json({ success: true, message: "Deleted Successfuly"})     

    }
    catch(err){
      console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    }
  }

