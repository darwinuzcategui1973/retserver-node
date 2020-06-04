require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/usuario"));


// conexion  a la base de datos
//mongodb+srv://darwin:Gmd123456@cluster0-wcnbe.mongodb.net/productosgmd1
// mongodb://localhost:27017/gmdproducto

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");


});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el Puerto: ", process.env.PORT);

});