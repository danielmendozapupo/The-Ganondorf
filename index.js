const express = require('express');


const app = express();
app.use(express.json());


const port = process.env.PORT || 8080;


app.use((req, res) => {
    res.status(404).send('Element Not Found');
});


app.listen(port, ()=>{
    console.log(`Ecommerce app listening at http://localhost:${port}`);
})
