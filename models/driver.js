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
        active : Boolean, ///active as a driver meaning the company allow this driver to use its platform
        available : Boolean, // available to drive meaning: the driver is in his car and accepting ride requests
        user : {type:mongoose.ObjectId, ref: 'User'},
            password:String,
        car:{type:mongoose.ObjectId, ref: 'Car'},
        location : { type:mongoose.ObjectId, ref: 'Address'}, // a function will generate random locations around the city
        passenger:{ type:mongoose.ObjectId, ref: 'Rider'},
        passenger_location: String,
        passenger_destination: String,
        hours_worked: Number,
        earnings: Number,
            reviews: [{}]
    }
)

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
