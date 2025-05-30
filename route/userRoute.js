import express from 'express';
import {getAllUsers, getUserById, updateUserById, deleteUserById } from '../controller/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/users', protect, authorizeRoles, getAllUsers);
router.get('/users/:id', protect, getUserById);
router.put('/users/:id', protect,  updateUserById);
router.delete('/users/:id', protect, authorizeRoles("admin"), deleteUserById);

export default router;