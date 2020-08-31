const express = require('express');

const app = express();

// aqui van todas las rutas
app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./grupo"));
app.use(require("./marca"));
app.use(require("./productoGMD"));
app.use(require("./uploads"));
app.use(require("./imagenes"));
app.use(require("./empresa"));


module.exports = app;