const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
  login,
  getCurrentUser,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const {
  updateUserProfileValidation,
  updateUserAvatarValidation,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUserById);
router.patch('/me', [updateUserProfileValidation, authMiddleware], updateProfileUser);
router.patch('/me/avatar', [updateUserAvatarValidation, authMiddleware], updateAvatarUser);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
