const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        active: Boolean,
        user : {type:mongoose.ObjectId, ref: 'User'},
        password: String,
        role : String

    }
)

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;