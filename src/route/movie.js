const express = require('express');
const router = express.Router();
const MovieController = require('../app/controllers/MovieController');
const verifyToken = require('../app/middlewares/verifyToken');

router.put('/:movieId', MovieController.updateOne);
router.delete('/destroy', MovieController.destroy);
router.delete('/:movieId', MovieController.deleteOne);
// router.get('/:movieId', MovieController.getOneById);
router.get('/:slug', MovieController.getOneBySlug);
router.delete('/', MovieController.deleteAll);
// router.post('/createMany', verifyToken, MovieController.createMany);
router.patch('/author', verifyToken, MovieController.updateAuthorForAll);
router.post('/', verifyToken, MovieController.createOne);
router.get('/', MovieController.get);

module.exports = router