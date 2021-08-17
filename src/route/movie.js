const express = require('express');
const router = express.Router();
const MovieController = require('../app/controllers/MovieController');
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/destroy', MovieController.destroy);
router.delete('/:movieId', MovieController.deleteOne);
router.delete('/', MovieController.deleteAll);
router.put('/:movieId', MovieController.updateOne);
router.patch('/author', verifyToken, MovieController.updateAuthorForAll);
// router.patch('/updateViEn', MovieController.updateViEn);
router.patch('/addCaster/:movieId', MovieController.addCaster);
// router.post('/createMany', verifyToken, MovieController.createMany);
router.post('/', verifyToken, MovieController.createOne);
// router.get('/:movieId', MovieController.getOneById);
// router.get('/getPerson/:id', MovieController.getByPersonId);
router.get('/getFavorites', verifyToken, MovieController.getFavorite);
router.get('/:slug', MovieController.getOneBySlug);
router.get('/', MovieController.get);

module.exports = router