import express from 'express';

import * as authenticationMiddleware from '../middleware/authenticationMiddleware.js'
import * as userController from '../controller/userController.js';
const router = express.Router();

router.get('/', userController.viewRecords);
router.post('/create', userController.createRecord);
router.put('/update/:id', userController.updateRecord);
router.delete('/delete/:id', userController.deleteRecord);
router.get('/getrecord/:id', userController.getrecord);
router.get('/search', userController.searchRecords); 

router.post('/signup', authenticationMiddleware.register)
router.post('/login', authenticationMiddleware.login)

export default router;