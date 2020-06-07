const expres = require("express");

const { verificaTokenImg } = require("../middlewares/autenticacion");


const fs = require('fs'); // file system
const path = require('path'); // path


let app = expres();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);


    console.log(pathImagen);

    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);

    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-img.png');

        res.sendFile(noImagePath);

    }





});




module.exports = app;