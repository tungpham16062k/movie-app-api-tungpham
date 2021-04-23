const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');
const checkCurrentUser = require('../app/middlewares/checkCurrentUser');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/getCurrent', checkCurrentUser, UserController.getCurrent);
router.get('/', UserController.getAll);

module.exports = router;