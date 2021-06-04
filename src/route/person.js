const express = require('express');
const router = express.Router();
const PersonController = require('../app/controllers/PersonController');
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/', PersonController.deleteAll);
router.post('/', verifyToken, PersonController.createOne);
router.get('/', PersonController.getAll);

module.exports = router;