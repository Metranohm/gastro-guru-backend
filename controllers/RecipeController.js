const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.getAllRecipes = async (req, res, next) => {
try {
const recipes = await Recipe.find({ author: req.user.id }).populate('author', 'name');
res.json(recipes);
} catch (error) {
next(error);
}
};

exports.getRecipeById = async (req, res, next) => {
try {
const recipe = await Recipe.findById(req.params.id)
    .populate('author', 'name')
    .populate('comments.author', 'name');
if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
}
res.json(recipe);
} catch (error) {
next(error);
}
};

exports.createRecipe = async (req, res, next) => {
try {
const { title, description, ingredients, instructions } = req.body;
const recipe = new Recipe({ title, description, ingredients, instructions, author: req.user.id });
await recipe.save();
res.status(201).json(recipe);
} catch (error) {
next(error);
}
};

exports.updateRecipe = async (req, res, next) => {
try {
const { title, description, ingredients, instructions } = req.body;
const recipe = await Recipe.findById(req.params.id);
if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
}
if (recipe.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to edit this recipe' });
}
recipe.title = title;
recipe.description = description;
recipe.ingredients = ingredients;
recipe.instructions = instructions;
await recipe.save();
res.json(recipe);
} catch (error) {
next(error);
}
};

exports.deleteRecipe = async (req, res, next) => {
try {
const recipe = await Recipe.findById(req.params.id);
if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
}
if (recipe.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
}
await recipe.remove();
res.json({ message: 'Recipe deleted successfully' });
} catch (error) {
next(error);
}
};

exports.shareRecipe = async (req, res, next) => {
try {
const recipe = await Recipe.findById(req.params.id);
if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
}
if (recipe.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to share this recipe' });
}
const user = await User.findOne({ email: req.body.email });
if (!user) {
    return res.status(404).json({ message: 'User not found' });
}
if (recipe.sharedWith.includes(user._id)) {
    return res.status(400).json({ message: 'Recipe already shared with this user' });
}
recipe.sharedWith.push(user._id);
await recipe.save();
res.json(recipe);
} catch (error) {
next(error);
}
};

exports.rateRecipe = async (req, res, next) => {
try {
const recipe = await Recipe.findById(req.params.id);
if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
}
if (recipe.author.toString() === req.user.id) {
    return res.status(400).json({ message: 'You cannot rate your own recipe' });
}
if (recipe.rating > 0 && recipe.ratingCount.includes(req.user.id)) {
    return res.status(400).json({ message: 'You have already rated this recipe' });
}
recipe.ratingCount.push(req.user.id);
recipe.rating = (recipe.rating + req.body.rating) / recipe.ratingCount.length;
await recipe.save();
res.json(recipe);
} catch (error) {
next(error);
}
};
