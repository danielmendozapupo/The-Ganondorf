// Here the driver model using the user model
/*
	Rider( reference to riders, would need update)
	Description:
	Position
	Availability
*/
const mongoose = require('mongoose');
const DriverSchema = new mongoose.Schema(
    {
        active : Boolean,
        available : Boolean,
        user : {type:mongoose.ObjectId, ref: 'User'},
        car:{type:mongoose.ObjectId, ref: 'Car'},
        location : String,
        passenger_location: String,
        passenger_destination: String,
        hours_worked: Number,
        earnings: Number
    }
)

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
