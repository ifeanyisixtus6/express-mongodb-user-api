import express from 'express';
import {getAllUsers, getUserById, updateUserById, deleteUserById } from '../controller/userController.js';
import { authorizeRoles } from '../middleware/roleBasedMiddleware.js';
const router = express.Router();

router.get('/users', authorizeRoles, getAllUsers);
router.get('/users/:id', authorizeRoles, getUserById);
router.put('/users/:id',   updateUserById);
router.delete('/users/:id', deleteUserById);

export default router;