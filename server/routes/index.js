const express = require('express');



const app = express();

// aqui van todas las rutas
// configuración global de rutas.
app.use("/api/login", require('./login'));
app.use("/api/usuario", require('./usuario'));
app.use("/api/empresas", require('./empresa'));
app.use("/api/todos", require('./busqueda'));
app.use("/api/upload",require("./uploads"));
app.use("/api/imagen",require("./imagen"));
app.use("/api/grupo",require("./grupo"));
app.use("/api/marca",require("./marca"));
app.use("/api/vendedor",require("./vendedor"));
app.use("/api/producto",require("./producto"));


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

module.exports =app;