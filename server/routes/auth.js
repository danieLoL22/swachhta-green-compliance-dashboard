const r=require('express').Router();const c=require('../controllers/authController');const{protect}=require('../middleware/auth');
r.post('/login',c.login);r.post('/register',c.register);r.get('/me',protect,c.me);module.exports=r;
