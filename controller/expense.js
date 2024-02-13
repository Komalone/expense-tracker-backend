
const Expense= require('../models/expense');
const User= require('../models/user');
const sequelize= require('../util/signUp');

const AWS= require('aws-sdk');
const uuidv1= require('uuid')

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

      const user= await User.findByPk(req.user.id)
      if (!user){
        throw new Error('user not found or user not available') 
      }
      //console.log("totalExpense", price);
      const totalExpense= user.totalExpense+Number(price)
      
      await User.update({
        totalExpense: totalExpense}, {where:{id: req.user.id}, transaction: t})
      await t.commit()   
      res.status(201).json({ Expense : totalExpense });
    }catch(err){
        console.log("post expense err", err)
        await t.rollback()
        res.status(500).json({error:err})
    }
}

exports.getExpense=async(req,res)=>{
    try{
      const page= parseInt(req.query.page) || 1;
      const limit=parseInt(req.query.limit) || 10;

      const offset= (page - 1) * limit;
    const expenses=await Expense.findAll({
      where:{userId:req.user.id},
      limit, offset
    });

    res.status(200).json({allExpenses:expenses});
    }catch(err){
        console.log('get user is failing', JSON.stringify(err))
        res.status(500).json({error:err })
    }
}

exports.deleteExpense=async(req,res)=>{
   const t=  await sequelize.transaction();
  try{

      const uId=req.params.id;
      //console.log("uid", uId)
        if(uId=='undefined'|| uId.length === 0){
            console.log('ID is missing')
            return res.status(400).json({success: false, })
        };

        const expense= await Expense.findOne({where : {id: uId}})
        const price= expense.dataValues.price;
        //console.log("price", expense.dataValues.price);
        const user= await User.findByPk(req.user.id)
        const totalExpense= user.totalExpense - Number(price);

        await User.update({
          totalExpense: totalExpense
          }, {where:{id: req.user.id}, transaction: t})

      const noofrows= await Expense.destroy({where:{id:uId,userId:req.user.id}})
        console.log("noofrows",noofrows)
    if(noofrows === 0){     
    return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
}
await t.commit()
return res.status(200).json({ success: true, message: "Deleted Successfuly"})     

    }
    catch(err){
      console.log(err);
      await t.rollback()
        return res.status(500).json({ success: true, message: "Failed"})
    }
  }

exports.downloadExp=async(req, res)=>{
  try{
    if(!req.user.ispremiumuser){
      return res.status(401).json({success: false, message: "User is not premium user"})
    }

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    })

    const s3= AWS.S3();
    const bucketName= 'ExpenseTrackerKOM';
    const objectKey= 'expense' + uuidv1() +'.txt';
    const data= JSON.stringify(await req.user.getExpense());

    const uploadParam={
      Bucket: bucketName,
      Key: objectKey,
      body: data
    }

    const uploadResult= await s3.upload(uploadParam).promise();

    const fileUrl= uploadResult.Location;

    res.status(201).json({fileUrl, success: true});
    
  }catch(err){
    res.status(500).json({error: err, success: false, message: "Something went wrong"})
  }
}