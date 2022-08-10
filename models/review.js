const mongoose = require('mongoose');

const reviewSchemaDefinition = {
  recipeId: { type: String, },
  username: { type: String, },
  postedDate: { type: Date, },
  review: { type: String, },
};

const reviewSchema = new mongoose.Schema(reviewSchemaDefinition);

module.exports = mongoose.model('Review', reviewSchema);