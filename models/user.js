// Create a model that represents a user in my db
const mongoose = require('mongoose');

const plm = require('passport-local-mongoose');

var userSchemaDefinition = {
  username: { type: String, },
  password: { type: String, },
  role: { type: String },

  //GitHub OAuth
  oauthId: { type: String },
  oauthProvider: { type: String }, 
  created: { type: Date },
};

var schemaObject = new mongoose.Schema(userSchemaDefinition);
//Extends the basic model functionality
schemaObject.plugin(plm);

//Export the model
module.exports = new mongoose.model('User', schemaObject);