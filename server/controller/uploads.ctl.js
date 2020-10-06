const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const Usuario = require('../models/usuario');
const Producto = require('../models/productoGMD');

const fs = require('fs'); // file system
const path = require('path'); // path

// opciones por defecto
// cuando se utiliza esto todos los archivo que se cargue
// caen en req.files lo que se este subiendo
// lo coloca en objeto req.files
//app.use(fileUpload());

//fileUpload
const fileUpload = ( req, res = response ) => {
//app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    
    // Validar tipo
    const tiposValidos = ['productos', 'usuarios','grupos','marcas','empresa'];

   // if (tiposValidos.indexOf(tipo) < 0) {
    if ( !tiposValidos.includes(tipo) ){

        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Los Tipos permitidas son ' + tiposValidos.join(', '),
                tipo_no_permitido:tipo
            }

        })

    }
    
    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No fueron subidos los archivos. '
        });
    }


    
    // El nombre del campo de entrada (es decir, "archivo") se utiliza
    //  para recuperar el archivo cargado 
    const archivo = req.files.imagen;
    console.log(archivo);

    // para  extraer la extesion del archivo
    console.log(archivo.name);
    const  nombreCortado = archivo.name.split('.');
    const extesion = nombreCortado[nombreCortado.length - 1];
    console.log(extesion);
    console.log(nombreCortado);

    // validar las extesiones
    // Extesiones permitidas
    const extesionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

 // if (extesionesValidas.indexOf(extesion) < 0) {
    if (!extesionesValidas.includes(extesion)) {


        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extesiones permitidas son ' + extesionesValidas.join(', '),
                ext_no_permitida: extesion
            }

        });

    }
   


    // cambiar nombre de archivo
    // let nombreArchivo1 = `${ id }-${ new Date().getMilliseconds() }.${ extesion }`;
    // Generar el nombre del archivo uuidc4
    const nombreArchivo = `${ uuidv4() }.${ extesion }`;
    console.log(nombreArchivo);
    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;
    console.log(path);


    // Use el método mv () para colocar el archivo en algún
    // lugar de su servidor 
    /*
    archivo.mv( path , (err) => {
    //archivo.mv( path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen',
                err
            });

        }

        //aqui imagen cargada
        console.log(tipo);
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);

        } else {

            imagenProducto(id, res, nombreArchivo);

        }

       


    });

    
/*
 
  res.json({
     ok: true,
     mensaje: '¡Archivo cargado!  Correctamente en ' + tipo,
     archivo: nombreArchivo
  });
    */  
 //*********************************************/  
    // con la otra manera
     // Mover la imagen
     archivo.mv( path , (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
   //******************************************************* */ 

};



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

module.exports = {fileUpload} ;