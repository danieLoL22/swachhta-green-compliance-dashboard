const mongoose=require('mongoose');
module.exports=mongoose.model('Location',new mongoose.Schema({name:{type:String,required:true,unique:true,trim:true},type:{type:String,default:'Block'},description:{type:String,default:''},incharge:{type:String,default:''},active:{type:Boolean,default:true}},{timestamps:true}));
