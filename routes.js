const express = require('express');
const passport = require('passport');
const UserController = require('./controllers/UserController');
const RecipeController = require('./controllers/RecipeController');

const router = express.Router();

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/user', passport.authenticate('jwt', { session: false }), UserController.getUser);

// Recipe routes
router.get('/recipes', passport.authenticate('jwt', { session: false }), RecipeController.getAllRecipes);
router.get('/recipes/:id', passport.authenticate('jwt', { session: false }), RecipeController.getRecipeById);
router.post('/recipes', passport.authenticate('jwt', { session: false }), RecipeController.createRecipe);
router.put('/recipes/:id', passport.authenticate('jwt', { session: false }), RecipeController.updateRecipe);
router.delete('/recipes/:id', passport.authenticate('jwt', { session: false }), RecipeController.deleteRecipe);
router.post('/recipes/:id/share', passport.authenticate('jwt', { session: false }), RecipeController.shareRecipe);
router.post('/recipes/:id/rate', passport.authenticate('jwt', { session: false }), RecipeController.rateRecipe);
// router.post('/recipes/:id/comment', passport.authenticate('jwt', { session: false }), RecipeController.commentOnRecipe);

module.exports = router;
