let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let productoSchema = new Schema({
    codGMD: {
        type: String,
        unique: true,
        required: [true, 'El Código es necesario']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo',
        required: true
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});


module.exports = mongoose.model('Producto', productoSchema);