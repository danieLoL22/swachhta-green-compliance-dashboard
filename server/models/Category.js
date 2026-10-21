const mongoose=require('mongoose');
module.exports=mongoose.model('Category',new mongoose.Schema({name:{type:String,required:true,unique:true},description:{type:String,default:''},icon:{type:String,default:'leaf'},active:{type:Boolean,default:true}},{timestamps:true}));
