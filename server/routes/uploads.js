const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// opciones por defecto
// cuando se utiliza esto todos los archivo que se cargue
// caen en req.files lo que se este subiendo
// lo coloca en objeto req.files
app.use(fileUpload());

app.put('/upload', function(req, res) {

    if (!req.files) {
        return res.status(400).
        json({
            ok: false,
            err: {
                message: 'No fueron subidos los archivos. '
            }
        });
    }
    // El nombre del campo de entrada (es decir, "archivo") se utiliza para recuperar el archivo cargado 
    let archivo = req.files.archivo
        // console.log(archivo);
        // Use el método mv () para colocar el archivo en algún lugar de su servidor 
    archivo.mv('uploads/filename.jpg', (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            mensaje: '¡Archivo cargado!'
        });
    });
});

module.exports = app;