let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let estadosValidos = {
    values: ['INICIAL', 'MODIFICADO', 'NUEVO'],
    menssage: '{VALUE} no es un Estado válido'
};

let productoSchema = new Schema({
    codigoProductoGmd: {
        type: String,
        //unique: true,
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
    oferta: {
        enOferta: {
            type: Boolean,
            required: true,
            default: false

        },
        ofertaValor: {
            type: Number,
            required: true,
            default: 0.0
        }
    },
    destacado: {
        type: Boolean,
        required: true,
        default: false
    },
    nuevo: {
        type: Boolean,
        required: true,
        default: false
    },
    estado: {
        type: String,
        default: "INICIAL",
        enum: estadosValidos
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
    vendedor_proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor'

    },
    idEmpresa: {
        type: Schema.Types.ObjectId,
        required: [true, "idEmpresa es Necesario"],
        ref: 'Empresa'
    },
}, {
    timestamps: true,
    versionKey: false
});

productoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});


module.exports = mongoose.model('Producto', productoSchema);