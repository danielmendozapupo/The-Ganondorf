const mongoose=require('mongoose');
const riderSchema= new mongoose.Schema({
    active:Boolean,
    user : {type:mongoose.ObjectId, ref: 'User'},
    location: String,
    destination: String,
    driver:{ type:mongoose.ObjectId, ref: 'Driver'},
    rate:[{}],
    cost_estimate: Number,
    driver_eta_arrive: String,
    password: String
});
const Rider=mongoose.model('Rider', riderSchema)
module.exports = Rider;