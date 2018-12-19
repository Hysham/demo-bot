var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  user_id: Number,
  timestamp:String,
  nic: String,
  phone: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');