const mongoose = require('mongoose');

const noteSchemaDefinition = {
  username: { type: String, },
  addedDate: { type: Date, },
  note: { type: String, },
};

const noteSchema = new mongoose.Schema(noteSchemaDefinition);

module.exports = mongoose.model('Note', noteSchema);