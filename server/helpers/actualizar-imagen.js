const Usuario = require('../models/usuario');
const fs = require('fs');
// const fs = require('fs'); // file system
const path = require('path'); // path

const Medico = require('../models/vendedor');
const Hospital = require('../models/productoGMD');

// const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');


const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}



const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    
    switch( tipo ) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if ( !medico ) {
                console.log('No es un médico por id');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen( pathViejo );

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;
        
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if ( !hospital ) {
                console.log('No es un hospital por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejo );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        break;
        
        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        break;
    }


}


// funciones anterio
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
                // img: nombreArchivo,
                msg: 'Archivo subido',
                nombreArchivo

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
// refactorizar
/*
const actulizarImagen = async (tipo, id, nombreArchivo) => {

    const tiposValidos = ['productos', 'usuarios','grupos','marcas','empresas'];

    if ( tiposValidos.includes(tipo) ){

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
                    // img: nombreArchivo,
                    msg: 'Archivo subido',
                    nombreArchivo
    
                });
    
            });
    
    
        });
    
    



     }


}

*/

module.exports = { 
    actualizarImagen,
    imagenUsuario,
    imagenProducto

}
