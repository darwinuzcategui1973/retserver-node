const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// obtener el esquema
let Schema = mongoose.Schema; //definir los campos de la colección y las reglas.
let vendedorSchema = new Schema({
    codigoVendedorGmd: {
        type: String,
        unique: true,
        required: [true, "El Codigo es Necesario!"]
    },
    nombre: {
        type: String,
        required: [true, "El nombre del es Necesario"]
    },
    idUsuario: {
        type: String,

    },
    infVendedor: {
        direccion: {
            type: String,
            required: false

        },
        telefonos: {
            type: [String]

        },
        comision: {
            type: Number

        },
        descuentoMax: {
            type: Number

        },

    },

    fotourl: {
        type: String,
        required: false

    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

vendedorSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

module.exports = mongoose.model("Vendedor", vendedorSchema);