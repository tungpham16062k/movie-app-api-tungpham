const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');
const checkCurrentUser = require('../app/middlewares/checkCurrentUser');
const verifyToken = require('../app/middlewares/verifyToken');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/:userId', UserController.deleteOne);
router.delete('/', UserController.deleteAllUser);
router.patch('/block/:userId', verifyToken, UserController.blockOne);
router.patch('/unblock/:userId', verifyToken, UserController.unBlockOne);
router.patch('/removeFav/:movieId', verifyToken, UserController.removeFavorites);
router.patch('/addFav/:movieId', verifyToken, UserController.addFavorites);
router.get('/getCurrent', checkCurrentUser, UserController.getCurrent);
router.get('/', UserController.getAll);

module.exports = router;