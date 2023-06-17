const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  comments: {
    type: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
