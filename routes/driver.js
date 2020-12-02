const express = require('express');

const User = require('../models/user');
const Driver = require('../models/driver');
const Car = require("../models/car");
const Rider = require("../models/rider");
const Address = require("../models/address");
const axios = require("axios");
const router = express.Router();

const googleApiKey ='AIzaSyCmpbSQfBIhSEn3w-gkQO3rjg0G0tBV9bA';
const addrUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Austin&key=${googleApiKey}`


router.get('/driver/location', async (req, res)=>{
    // const randomAddress = async()=> {
      axios(addrUrl)
            .then(function (response) {
                const len = response.data["results"].length;
                const addr = response.data["results"][Math.floor(Math.random()*len)]["formatted_address"]
            res.send(addr ? addr:404)
            })
            .catch(function (error) {
                console.log(error);
            });
    // }

})


router.get('/driver/:DriverId', async (req, res)=>{
    const driverFound = await Driver.findById({_id: req.params.DriverId}).populate('user');
    res.send(driverFound || 404);
})

router.get('/driver/:addressId', async (req, res)=>{
    const addressFound = await Address.findById({_id: req.params.addressId}).populate('address');
    res.send(addressFound || 404);
})




//get the rider by id
router.get('/driver/driverId/:riderId', async (req, res)=>{
    // const driverFound = await Driver.findById({_id: req.params.driverId});
    const riderFound = await Rider.find({passenger: req.params.riderId}).populate('user').firstName;
    res.send(riderFound || 404);
})

//get the car by id
router.get('/driver/:driverId/:carId', async (req, res)=>{
    const driverFound = await Driver.findById({_id: req.params.driverId});
    console.log(driverFound);
    const CarFound = await driverFound.find({car: req.params.carId}).populate('car');
    res.send(CarFound || 404);
})



/////////////////////////////////////////////////////////////
////////////// Update Users, Driver, Riders ////////////////
router.patch(`/driver/:driverId`, async (req,res)=>{
    // if(!req.body.firstName || !req.body.lastName){
    //     res.send(422);
    // }
    try{
        const updatedUser = await Driver.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
        res.send( updatedUser ? updatedUser : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})



////Update User account such as name, password etc...
router.patch('/driver/:userId', async (req,res)=>{
    try{
        const updatedDriver = await User.findByIdAndUpdate(req.params.userId, req.body,{returnOriginal: false});
        res.send( updatedDriver ? updatedDriver : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})
////Update User account such as name, password etc...
router.put('/driver/:driverId/driveon', async (req,res)=>{
    // const myaddress = await Address.find({});
    const driver = await Driver.findById({_id : req.params.driverId});
    // const address_ = randomAddress();
    try{
        const updatedDriverLocation = await Address.findOneAndUpdate(driver.location, req.body,{returnOriginal: false});
        res.send( updatedDriverLocation ? updatedDriverLocation : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})

/*
* // const queryAllDriver = () => {
    //     //Where User is you mongoose user model
    await Driver.find({} , (err, drivers) => {
        if(err){
            console.log(err)
        } //do something...
        drivers.map(driver => {
            driver.location = address[Math.floor(Math.random() * address.length)];
            driver.save();
            //Do something with the user
        })
    })
    // }

* */

////Update User account such as name, password etc...
router.patch('/driver/:driverId', async (req,res)=>{
    try{
        const updatedDriver = await User.findByIdAndUpdate(req.params.userId, req.body,{returnOriginal: false});
        res.send( updatedDriver ? updatedDriver : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})


//Update Car
router.patch('/driver/:CarId', async (req,res)=>{
    try{
        const updatedCar = await Car.findByIdAndUpdate(req.params.CarId, req.body,{returnOriginal: false});
        res.send( updatedCar ? updatedCar : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})

/*
router.patch('/admin/car/:id', async (req,res)=>{
    try{
        const updatedRider = await Car.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
        res.send( updatedCar ? updatedCar : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})*/


router.delete('/driver/:DriverId', async(req,res)=>{
    const deletedUser = await Driver.findByIdAndDelete(req.params.DriverId);
    // console.log(deletedUser);
    /*if(deletedUser.role === 'driver'){
        const toBeDeleted = await Driver.find({user:deletedUser._id});
        /!*const foundDriver = *!/await Driver.findByIdAndDelete(toBeDeleted._id);
        /!*deletedUser.role;*!/
    }else{
        const toBeDeleted = await Rider.find({user:deletedUser._id});
        /!*const foundRider =*!/ await Rider.user.findByIdAndDelete(toBeDeleted._id);
    }*/
    res.send(deletedUser ? deletedUser : 404);
})


///////////////////////////////////////////////////////////////







module.exports = router;