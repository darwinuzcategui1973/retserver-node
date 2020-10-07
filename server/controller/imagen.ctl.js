// importaciones
const { response } = require("express");
const fs = require('fs'); // file system
const path = require('path'); // path
// funcion Retornar la imagen
const verImagen = async (req, res=response) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    
    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);

    } else {
        const noImagePath = path.resolve(__dirname, '../assets/no-img.png');

        res.sendFile(noImagePath);
    }

};

module.exports = { verImagen }