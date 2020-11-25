
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
    {
        active : Boolean,
        driver : {type:mongoose.ObjectId, ref: 'Driver'},
        color : String,
        make: String,
        year : String,
        model : String
    }
)

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
