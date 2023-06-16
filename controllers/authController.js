const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')
const JWT = require ('jsonwebtoken')

const registerController = async (req,res)=>{
    try {
      const{name,email,password,phone,address,answer} = req.body;
      if(!name){
        return res.send({message:'Name is required'})
      }
      if(!email){
        return res.send({message:'Email is required'})
      }
      if(!password){
        return res.send({message:'Password is required'})
      }
      if(!phone){
        return res.send({message:'Phone is required'})
      }
      if(!address){
        return res.send({message:'Address is required'})
      }
      if(!answer){
        return res.send({message:'Answer is required'})
      }

      const existingUser = await userModel.findOne({email})
      if(existingUser){
        return res.status(200).send({
          success:false,
          message:'Already Registered User',
        })
      }
      const hashedPassword = await hashPassword(password)
      const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
      res.status(201).send({
        success:true,
        message:'User Registered Successfully',user,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        message:'Error in registeration',error,
      })
    }
};

const loginController =  async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(404).send({
        success:false,
        message:'Invalid email or password'
      })
    }
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).send({
        success:false,
        message:"Email is not registered"
      })
    }
    const match = await comparePassword(password,user.password)
    if(!match){
      return res.status(200).send({
        success:false,
        message:"Invalid password"
      })
    }
    const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
    res.status(200).send({
      success:true,
      message:"Login Successfully",
      user:{
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,
      },token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error in login',error,
    })
  }
}

const forgotPasswordController = async(req,res)=> {
  try {
    const {email,answer,newPassword} = req.body
    if(!email){
      res.status(400).send({message:'Email is required'})
    }
    if(!answer){
      res.status(400).send({message:'Answer is required'})
    }
    if(!newPassword){
      res.status(400).send({message:'New Password is required'})
    }
    const user = await userModel.findOne({email,answer})
    if(!user){
      return res.status(404).send({
        success:false,
        message:'Wrong Email or Answer'
      })
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id,{password:hashed});
    res.status(200).send({
      success:true,
      message:"Password Reset Successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Something went wrong',error,
    })
  }
};

//update profile
const updateProfileController = async(req,res) => {
  try {
    const {name,email,password,phone,address} = req.body
    const user = await userModel.findById(req.user._id)
    if(password && password.length < 6){
      return res.JSON({error:'Password is required and 6 charcter long'})
    }
    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
      name : name || user.name,
      password : hashedPassword || user.password,
      phone : phone || user.phone,
      address : address || user.address,
    },{new:true})
    res.status(200).send({
      success:true,
      message:'Profile Updated Successfully',updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Something went wrong',error,
    })
  }
}

//orders
const getOrdersController = async(req,res) => {
 try {
  const orders = await orderModel
   .find({buyer:req.user._id})
   .populate('products','-photo')
   .populate('buyer','name')
   res.json(orders)
 } catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:'Something went wrong',error
  })
 }
}

//get all orders
const getAllOrdersController = async(req,res) => {
  try {
   const orders = await orderModel
    .find({})
    .populate('products','-photo')
    .populate('buyer','name')
    .sort({createdAt: '-1'})
    res.json(orders)
  } catch (error) {
   console.log(error)
   res.status(500).send({
     success:false,
     message:'Something went wrong',error,
   })
  }
 }

 //order status update
 const orderStatusController = async(req,res) => {
  try {
    const {orderId} = req.params
    const {status} = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Something went wrong',error,
    })
  }
 }

//test
const testController= async(req,res)=>{
  res.send('protected route')
}

module.exports = { registerController, loginController, testController,forgotPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderStatusController }