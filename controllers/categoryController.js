const  slugify  = require("slugify");
const CategoryModel = require("../models/categoryModel");


//create category
const createCategoryController = async(req,res)=>{
   try {
    const {name}=req.body;
    if(!name){
      return res.status(401).send({message:'Name is required'})
    }
    const existingCategory = await CategoryModel.findOne({name})
    if(existingCategory){
      return res.status(200).send({
        success:true,
        message:"Category already exists"
      })
    }
    const category = await new CategoryModel({name,slug:slugify(name),}).save();
    res.status(201).send({
      success:true,
      message:'New Category Created',category
    })
   } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error in category',error
    })
   }
}

//update category
const updateCategoryController = async(req,res)=>{
  try {
    const {name} = req.body;
    const {id} = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({
      success:true,
      message:'Category updated successfully',category
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while updating category',error
    })
  }
}

//get category
const categoryController = async(req,res) =>{
  try {
    const category = await CategoryModel.find({})
    res.status(200).send({
      success:true,
      message:'All Categories List',category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while getting all categories',error,
    })
  }
}

//get single category
const singleCategoryController = async(req,res) =>{
  try {
    const category = await CategoryModel.findOne({slug:req.params.slug})
    res.status(200).send({
      success:true,
      message:'Get a Category successfully',category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error in getting a category',error
    })
  }
}

//delete category
const deleteCategoryController = async(req,res) =>{
 try {
  const {id} = req.params 
  const category = await CategoryModel.findByIdAndDelete(id)
  res.status(200).send({
    success:true,
    message:'Category Deleted Successfully',category
  })
 } catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:'Error while deleting category',error
  })
 }
}

module.exports = {createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController}