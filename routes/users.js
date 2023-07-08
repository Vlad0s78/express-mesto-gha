const express = require('express');
const {
  getUsers, getUserById, createUser, updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/me', updateProfileUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
