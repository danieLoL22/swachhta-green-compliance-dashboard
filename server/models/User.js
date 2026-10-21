const mongoose=require('mongoose');const bcrypt=require('bcryptjs');
const s=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true,minlength:6},role:{type:String,enum:['admin','inspector'],default:'inspector'},phone:{type:String,default:''},department:{type:String,default:''},active:{type:Boolean,default:true}},{timestamps:true});
s.pre('save',async function(next){if(!this.isModified('password'))return next();const salt=await bcrypt.genSalt(10);this.password=await bcrypt.hash(this.password,salt);next();});
s.methods.comparePassword=function(p){return bcrypt.compare(p,this.password);};
module.exports=mongoose.model('User',s);
