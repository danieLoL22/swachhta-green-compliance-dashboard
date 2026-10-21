const multer=require('multer');const path=require('path');const fs=require('fs');
const dir=path.join(__dirname,'..','uploads');if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
const storage=multer.diskStorage({destination:(r,f,cb)=>cb(null,dir),filename:(r,f,cb)=>{const ext=path.extname(f.originalname);cb(null,Date.now()+'-'+Math.round(Math.random()*1e9)+ext);}});
function fileFilter(r,file,cb){const ok=['image/jpeg','image/png','image/webp','image/jpg','application/pdf'];if(ok.includes(file.mimetype))cb(null,true);else cb(new Error('Only JPG/PNG/WEBP/PDF allowed'),false);}
const upload=multer({storage,limits:{fileSize:5*1024*1024},fileFilter});
module.exports=upload;
