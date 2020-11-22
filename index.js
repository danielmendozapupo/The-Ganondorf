const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());


const port = process.env.PORT || 8080;

const User = require('./models/user');


//Database name
const dbName = 'NoUber_Project';
let database;

const url = `mongodb+srv://dbUser:dbUserPassword@cluster0.ij9xt.mongodb.net/${dbName}?retryWrites=true&w=majority`;


//axios header config
const config = {
    headers :{
        'X-API-KEY' : 'a721d0c518cc4122995f8fa99ae8c2be'
    }
}

const initDatabase = async ()=>{
    database = await mongoose.connect(url);
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
    const phoneNumber = await axios.get('https://randommer.io/api/Phone/Generate?CountryCode=US&Quantity=50');

    const roles = ['driver', 'rider'];

    const extensions = ['@hotmail.com', '@gmail.com', '@yahoo.com'];

    const results = await Promise.all([firstNamePromise, lastNamePromise]);
    results[0].data.forEach((name, index) => {
        const firstName = name;
        const lastName = results[1].data[index];
        const email = name.toLowerCase() +'.' + results[1].data[index].toLowerCase() +
            extensions[Math.floor(Math.random() * extensions.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        users.push({firstName, lastName, phoneNumber,email,login:`${firstName}.${lastName}`,password: 'password123'});
    });

    await User.create(users);

};


const initializeAllData = async ()=>{
    await initDatabase();
    // await User.deleteMany({}); // clean the database before populate it.

    await initializeUsers();
};

initializeAllData();

//app.use();

app.use((req, res) => {
    res.status(404).send('Element Not Found');
});


app.listen(port, ()=>{
    console.log(`Ecommerce app listening at http://localhost:${port}`);
})
