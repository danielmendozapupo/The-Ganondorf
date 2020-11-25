const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const carData = require('./data/cardata.json');
const Car = require('./models/car')
const app = express();
app.use(express.json());


const port = process.env.PORT || 8080;

const User = require('./models/user');
const Driver = require("./models/driver");
const Rider = require("./models/rider");
const Admin = require("./models/admin");

//Database name
// const dbName = 'NoUber_Project';
let database;

// const url = `mongodb+srv://dbUser:dbUserPassword@cluster0.ij9xt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const url = `mongodb+srv://kinpr00:Kin12345@cluster0.rwres.mongodb.net/Nuber?retryWrites=true&w=majority`

//axios header config
const config = {
    headers :{
        'X-API-KEY' : 'a721d0c518cc4122995f8fa99ae8c2be'
    }
}

const initDatabase = async ()=>{
    database = await mongoose.connect(url,{useCreateIndex: true, useUnifiedTopology:true, useNewUrlParser: true });
    if(database){
        console.log('Successfully connected to my DB');
    }
    else{
        console.log('Error connecting to my DB');
    }
}


const initializeUsers = async()=>{
    const users = [];

    const firstNamePromise = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50',config);
    const lastNamePromise = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);
    const phoneNumberPromise = await axios.get('https://randommer.io/api/Phone/Generate?CountryCode=US&Quantity=50',config);

    const roles = ['driver', 'rider'];

    const extensions = ['@hotmail.com', '@gmail.com', '@yahoo.com'];

    const results = await Promise.all([firstNamePromise, lastNamePromise, phoneNumberPromise]);
    results[0].data.forEach((name, index) => {
        const firstName = name;
        const lastName = results[1].data[index];
        const phoneNumber = results[2].data[index];
        const email = name.toLowerCase() +'.' + results[1].data[index].toLowerCase() +
            extensions[Math.floor(Math.random() * extensions.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        users.push({firstName, lastName, phoneNumber: phoneNumber, email,login:`${firstName}.${lastName}`,
            password: 'password123', role:role});
    });

    await User.create(users);


};

const initializeDriverRider= async ()=>{
    const drivers =[];
    const riders = [];
    const users = await User.find({});
    const cars =await Car.find({})


    users.forEach(user=>{
        if(user.role ==='driver'){
            const assignedCar = cars[Math.floor(Math.random()*cars.length)];

            drivers.push({active:true, available: true,user: user, car: assignedCar,location: '', passenger_location:'',passenger_destination:'',
                hours_worked:0, earnings: 0, password: user.password,reviews: [{}]})
        }
        if(user.role === 'rider'){
            riders.push({active: true, user: user, location: '', destination: '',driver: Object._id, password: user.password,cost_estimate: 0, driver_eta_arrive:'',rate:[{}]})
        }
    })
    await Driver.create(drivers);
    await Rider.create(riders);
}


const initializeCar = async ()=>{
    const cars = [];
    const storeCars = carData;
    const carcolors =['blue', 'red', 'orange', 'yellow', 'black', 'white'];
    const years = ['2009', '2010', '2015', '2017', '2018', '2019', '2020'];
    storeCars.forEach(car=>{
        const color = carcolors[Math.floor(Math.random()*carcolors.length)];
        const year = years[Math.floor(Math.random()*years.length)];
        cars.push({active:true, color: color, make: car.make, model: car.model,year: year});
    })
    await Car.create(cars);
}

const initializeAdmin= async ()=>{
    const admin = [];
    const userForAdmin = [];
    const firstNamePromise = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=1',config);
    const lastNamePromise = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=1', config);
    const phoneNumberPromise = await axios.get('https://randommer.io/api/Phone/Generate?CountryCode=US&Quantity=1',config);

    const extensions = ['@hotmail.com', '@gmail.com', '@yahoo.com'];

    const results = await Promise.all([firstNamePromise, lastNamePromise, phoneNumberPromise]);
    const users = await User.find({});

    results[0].data.forEach((name, index) => {
        const firstName = name;
        const lastName = results[1].data[index];
        const phoneNumber = results[2].data[index];
        const email = name.toLowerCase() +'.' + results[1].data[index].toLowerCase() +
            extensions[Math.floor(Math.random() * extensions.length)];

        const newAdmin = {firstName, lastName, phoneNumber: phoneNumber, email,login:`${firstName}.${lastName}`,
            password: 'admin', role:'admin'};

        // console.log(users);
        userForAdmin.push(newAdmin);

    });
    const userAssign = await User.create(userForAdmin[0]);
    admin.push({active: true, user: userAssign, password: userAssign.password,role:userAssign.role});

    await Admin.create(admin);
}


const initializeAllData = async ()=>{
    // await User.deleteMany({}); // clean the database before populate it.
    // await Driver.deleteMany({});
    // await Rider.deleteMany({})
    // await Car.deleteMany({});

    await initDatabase();
    // await User.deleteMany({}); // clean the database before populate it.
    // await initializeCar();
    // await initializeUsers();
    // await initializeDriverRider();
    // await initializeAdmin();
};

initializeAllData();

//app.use();

app.use((req, res) => {
    res.status(404).send('Element Not Found');
});


app.listen(port, ()=>{
    console.log(`Ecommerce app listening at http://localhost:${port}`);
})
