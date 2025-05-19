const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
const validateObjectId = require('../middleware/userMiddleware')

router.post('/users', controller.createUser);
router.get('/users', controller.getAllUsers);
router.get('/users/:id', validateObjectId, controller.getUserById);
router.put('/users/:id',  validateObjectId, controller.updateUserById);
router.delete('/users/:id', validateObjectId, controller.deleteUserById);

module.exports = router;
