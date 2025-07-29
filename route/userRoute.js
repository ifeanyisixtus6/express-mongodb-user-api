import express from 'express';
import {getAllUsers, getUserById, updateUserById, softDeleteUser, deleteUserById } from '../controller/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/userMiddleware.js';


const router = express.Router();


// Admin only
router.get('/users', protect, authorizeRoles("admin"), getAllUsers);


// Self or admin 
router.get('/users/:id', protect, validateObjectId, getUserById);
router.patch('/users/:id/delete', protect, validateObjectId, softDeleteUser)
router.put('/users/:id', protect, validateObjectId,  updateUserById);
router.delete('/users/:id', protect, validateObjectId, deleteUserById);


export default router;


