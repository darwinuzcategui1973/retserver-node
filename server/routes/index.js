const ruta = require('./usuario')
const express = require('express');



const app = express();

// aqui van todas las rutas
ruta.use(require("./usuario"));
/*
app.use(require("./login"));
app.use(require("./grupo"));
app.use(require("./marca"));
app.use(require("./productoGMD"));
app.use(require("./uploads"));
app.use(require("./imagenes"));
app.use(require("./empresa"));
app.use(require("./vendedor"));
*/

module.exports =ruta;