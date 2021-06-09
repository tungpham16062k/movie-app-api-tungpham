const express = require('express');
const router = express.Router();
const CategoryController = require('../app/controllers/CategoryController');
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/', CategoryController.deleteAll)
router.post('/createMany', verifyToken, CategoryController.createMany);
router.put('/:categoryId', CategoryController.updateOne);
router.patch('/author', verifyToken, CategoryController.updateAuthorForAll);
router.post('/', verifyToken, CategoryController.createOne);
router.get('/', CategoryController.getAll);

module.exports = router;