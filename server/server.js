require('./config/config');

// typeScript
// import express from 'express;
// node es asi
const express = require('express');
const app = express();
// funcion de conexion base datos
const { dbConectar } =require ('./database/config')

const path = require('path');

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, "../public")));

// console.log(path.resolve(__dirname, "../public"));




// configuración global de rutas.
app.use(require("./routes/index"));

// me conecto a la base datos
dbConectar();

app.listen(process.env.PORT, () => {
    console.log("Escuchando el Puerto: ", process.env.PORT);

});