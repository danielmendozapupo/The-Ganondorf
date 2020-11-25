//Here user model
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName : String,
        lastName : String,
        email: String,
        phoneNumber : String,
            password: String,
        role : String
        /*,
        active: Boolean*/
    }
)

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;