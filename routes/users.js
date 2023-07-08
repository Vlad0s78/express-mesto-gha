const express = require('express');
const { getUsers, getUserById, createUser } = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);

module.exports = router;
