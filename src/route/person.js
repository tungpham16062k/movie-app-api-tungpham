const express = require('express');
const router = express.Router();
const PersonController = require('../app/controllers/PersonController');
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/', PersonController.deleteAll);
router.patch('/author', verifyToken, PersonController.updateAuthorForAll);
router.post('/createMany', verifyToken, PersonController.createMany);
router.post('/', verifyToken, PersonController.createOne);
router.get('/:slug', PersonController.getOneBySlug);
router.get('/', PersonController.getAll);

module.exports = router;