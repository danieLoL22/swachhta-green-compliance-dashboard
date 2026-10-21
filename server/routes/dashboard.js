const r=require('express').Router();const c=require('../controllers/dashboardController');const{protect}=require('../middleware/auth');
r.use(protect);r.get('/stats',c.stats);module.exports=r;
