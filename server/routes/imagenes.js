const expres = require("express");

const { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");


const fs = require('fs'); // file system
const path = require('path'); // path


let app = expres();

app.get('/imagen/:tipo/:img', (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathimg = `./uploads/${tipo}/${img}`;

    let noImagePath = path.resolve(__dirname, '../assets/no-img.png');

    res.sendFile(noImagePath);




});




module.exports = app;