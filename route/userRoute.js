import express from 'express';
import {createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controller/userController.js';
import validateObjectId from '../middleware/userMiddleware.js'
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', validateObjectId, getUserById);
router.put('/users/:id',  validateObjectId, updateUserById);
router.delete('/users/:id', validateObjectId, deleteUserById);

export default router;