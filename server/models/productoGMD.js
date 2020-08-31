let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");



let productoSchema = new Schema({
    codigo: {
        type: String,
        unique: true,
        required: [true, 'El Código es necesario']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioBss: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    precioDolares: {
        type: Number,
        required: [true, 'El precio únitario Dolar es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    unidadm: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    fotoUrl: {
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
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    }
});

productoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});


module.exports = mongoose.model('Producto', productoSchema);