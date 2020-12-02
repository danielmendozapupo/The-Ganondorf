const express = require('express');

const User = require('../models/user');
const Rider = require('../models/rider');
const Driver = require('../models/driver');
const Car = require("../models/car");
const Address = require('../models/address')

const router = express.Router();

router.get('/admin/user/:UserId', async (req, res)=>{
    const userFound = await User.findById({_id: req.params.UserId})/*.populate('')*/;
    res.send(userFound || 404);
})

router.get('/admin/address', async (req, res)=>{
        const foundAddress = await Address.find({})/*.populate('address');*/
        console.log(foundAddress);
        res.send(foundAddress ? foundAddress : 404);
    })




//Get all user that
router.get('/admin/users', async (req, res)=>{
    const foundUsers = await User.find({
        firstName : new RegExp(req.query.firstName),
        lastName : new RegExp(req.query.lastName),
        email: new RegExp(req.query.email)
    })/*.populate('')*/;
    //check for sessions
    console.log(foundUsers);
    res.send(foundUsers ? foundUsers:404);
})


////////////// Get all the drivers or query the driver by firstName //////////////////////////////////////
router.get('/admin/users/drivers', async (req, res)=>{
    /* const foundUsers = await Driver.find({
         firstName : new RegExp(req.query.firstName),
         lastName : new RegExp(req.query.lastName),
         email: new RegExp(req.query.email)
     })/!*.populate('')*!/;
     //check for sessions

     res.send(foundUsers ? foundUsers:404);*/
    if(req.query.firstName){
        await Driver.user.find({firstName: req.query.firstName })
            .then( foundDrivers =>{
            console.log(foundDrivers);
            res.send(foundDrivers);
        }).catch(err => {
            console.error(err);
        })
    }else{
        Driver.find({}, function (err,drivers){
            let userList ={};
            drivers.forEach(function(driver){
                userList[driver._id] = driver;
            });
            res.send(userList);
        });
    }
})


router.get('/admin/user/driver/:driverId', async (req, res)=>{
    const driverFound = await Driver.findById({_id: req.params.driverId}).populate('user');
    res.send(driverFound || 404);
})


//get the rider by id
router.get('/admin/:userId/driver', async (req, res)=>{
    const driverFound = await Rider.find({user: req.params.userId}).populate('user');
    res.send(riderFound || 404);
})



/////////////////// Get all the riders /////////////////////////////////
/*
router.get('/admin/users/riders', async (req, res)=>{
    const foundRiders = await Rider.find({
        firstName : new RegExp(req.query.firstName),
        lastName : new RegExp(req.query.lastName),
        email: new RegExp(req.query.email)
    })/!*.populate('')*!/;
    //check for sessions
    console.log(foundRiders);
    res.send(foundRiders ? foundRiders:404);
})
*/

router.get('/admin/users/riders', async (req, res)=>{
    /* const foundUsers = await Driver.find({
         firstName : new RegExp(req.query.firstName),
         lastName : new RegExp(req.query.lastName),
         email: new RegExp(req.query.email)
     })/!*.populate('')*!/;
     //check for sessions

     res.send(foundUsers ? foundUsers:404);*/
    if(req.query.firstName){
        await Rider.user.find({firstName: req.query.firstName }).then( foundRiders =>{
            console.log(foundRiders);
            res.send(foundRiders);
        }).catch(err => {
            console.error(err);
        })
    }else{
        Rider.find({}, function (err,riders){
            let riderList ={};
            riders.forEach(function(rider){
                riderList[rider._id] = rider;
            });
            res.send(riderList);
        });
    }
})


//get the rider by id
router.get('/admin/user/rider/:riderId', async (req, res)=>{
    const riderFound = await Rider.findById({_id: req.params.riderId}).populate('user');
    res.send(riderFound || 404);
})


//get the rider by id
router.get('/admin/:userId/rider', async (req, res)=>{
    const riderFound = await Rider.find({user: req.params.userId}).populate('user');
    res.send(riderFound || 404);
})

//Creates a new  user
router.post('/admin/user', async(req, res)=>{
    const newUser = await User.create(req.body);
    await newUser.save();
    if(req.body.role == 'driver'){
        const newDriver = await Driver.create({active:false, available:false, user:newUser,
            car:{}, location:"", passenger_location:"", passenger_destination:"",hours_worked:0,earnings:0, reviews:[]});
        await newDriver.save();
    }else{
        const newRider = await Rider.create({active:false, user:newUser, location:"", destination:"",
            rate:[{}],driver_eta_arrive:"", password:""});
        await newRider.save();
    }
    res.send(newUser ? newUser : 500);
})

router.post('/admin/driver', async(req, res)=>{
    const newDriver = await Driver.create(req.body);
    const newCar = await Car.create();
    newDriver.car= newCar
    await newDriver.save();
    res.send(newDriver ? newDriver : 500);
})

router.post('/admin/rider', async(req, res)=>{
    const newRider = await Rider.create(req.body);
    await newRider.save();
    res.send(newRider ? newRider : 500);
})

/////////////////////////////////////////////////////////////
////////////// Update Users, Driver, Riders ////////////////
router.patch(`/admin/user/:id`, async (req,res)=>{
    // if(!req.body.firstName || !req.body.lastName){
    //     res.send(422);
    // }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
        res.send( updatedUser ? updatedUser : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})

router.patch('/admin/driver/:id', async (req,res)=>{
    try{
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
        res.send( updatedDriver ? updatedDriver : 404);
    }catch (err){
        res.status(400).json({msg:err});
    }
})

router.patch('/admin/rider/:id', async (req,res)=>{
    try{
        const updatedRider = await Rider.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
        res.send( updatedRider ? updatedRider : 404);
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


router.delete('/admin/user/:UserId', async(req,res)=>{
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    // console.log(deletedUser);
    if(deletedUser){
        if(deletedUser.role ==='driver'){
            const toBeDeleted = await Driver.find({user:deletedUser._id});
            await Driver.findByIdAndDelete(toBeDeleted._id);
        }else{
            const toBeDeleted = await Rider.find({user:deletedUser._id});
            await Rider.user.findByIdAndDelete(toBeDeleted._id);
        }
    }
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