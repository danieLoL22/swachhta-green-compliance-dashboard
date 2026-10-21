const r=require('express').Router();const c=require('../controllers/userController');const{protect,authorize}=require('../middleware/auth');
r.use(protect);r.get('/',authorize('admin'),c.list);r.post('/',authorize('admin'),c.create);r.put('/profile',c.updateProfile);r.put('/:id',authorize('admin'),c.update);r.delete('/:id',authorize('admin'),c.remove);module.exports=r;
