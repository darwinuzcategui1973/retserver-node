const express = require('express');

const app = express();

// aqui van todas las rutas
app.use(require("./usuario"));
app.use(require("./login"));




module.exports = app;