const mongoose=require('mongoose');
module.exports=mongoose.model('Standard',new mongoose.Schema({title:{type:String,required:true},description:{type:String,default:''},category:{type:mongoose.Schema.Types.ObjectId,ref:'Category',required:true},active:{type:Boolean,default:true}},{timestamps:true}));
