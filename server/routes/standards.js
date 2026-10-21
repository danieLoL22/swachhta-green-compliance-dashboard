const r=require('express').Router();const c=require('../controllers/standardController');const{protect,authorize}=require('../middleware/auth');
r.use(protect);r.get('/',c.list);r.post('/',authorize('admin'),c.create);r.put('/:id',authorize('admin'),c.update);r.delete('/:id',authorize('admin'),c.remove);module.exports=r;
