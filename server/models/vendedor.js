const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// obtener el esquema
let Schema = mongoose.Schema; //definir los campos de la colección y las reglas.
let estadosValidos = {
    values: ['INICIAL', 'MODIFICADO', 'NUEVO'],
    menssage: '{VALUE} no es un Estado válido'
};

let vendedorSchema = new Schema({
    codigoVendedorGmd: {
        type: String,
        // unique: true,
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
            type: String
                //type: [String]

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
    estado: {
        type: String,
        default: "INICIAL",
        enum: estadosValidos
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true,
    versionKey: false
}, {  collection: 'vendedores' });

vendedorSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

module.exports = mongoose.model("Vendedor", vendedorSchema);