const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/productoGMD');

const fs = require('fs'); // file system
const path = require('path'); // path

// opciones por defecto
// cuando se utiliza esto todos los archivo que se cargue
// caen en req.files lo que se este subiendo
// lo coloca en objeto req.files
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


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
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extesion = nombreCortado[nombreCortado.length - 1];


    //console.log(extesion);
    // Validar tipo 
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los Tipos permitidas son ' + tiposValidos.join(', '),
                tipo
            }

        })

    }


    // Extesiones permitidas
    let extesionesValidas = ['png', 'jpg', 'gif', 'jpeg '];

    if (extesionesValidas.indexOf(extesion) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extesiones permitidas son ' + extesionesValidas.join(', '),
                ext: extesion
            }

        })

    }


    // cambiar nombre de archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extesion }`;
    console.log(nombreArchivo);






    // Use el método mv () para colocar el archivo en algún lugar de su servidor 
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        //aqui imagen cargada
        console.log(tipo);
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);

        } else {

            imagenProducto(id, res, nombreArchivo);

        }

        /*
                res.json({
                    ok: true,
                    mensaje: '¡Archivo cargado!  Correctamente en ' + tipo,
                    archivo: nombreArchivo
                });
                */


    });
});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe!'
                }
            });
        }






        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            });

        });


    });




}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Productos no Existe!'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((error, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo

            });

        });


    });


}

function borrarArchivo(nombreImagen, tipo) {

    // eliminamos del  imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    console.log(pathImagen);


    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); // borrar el archivo
    }

}

module.exports = app;