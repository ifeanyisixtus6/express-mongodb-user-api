import express from 'express';
import {getAllUsers, getUserById, updateUserById, deleteUserById } from '../controller/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();


// Admin only
router.get('/users', protect, authorizeRoles("admin"), getAllUsers);
router.delete('/users/:id', protect, authorizeRoles("admin"), deleteUserById);

// Self or admin 
router.get('/users/:id', protect, getUserById);
router.put('/users/:id', protect,  updateUserById);


export default router;


