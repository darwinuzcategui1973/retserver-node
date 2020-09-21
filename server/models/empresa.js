const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// obtener el esquema
let Schema = mongoose.Schema; //definir los campos de la colección y las reglas.
let empresaSchema = new Schema({
    codigoEmpresa: {
        type: String,
        unique: true,
        required: [true, "El Código de la Empresa es Necesario!"]
    },
    nombre: {
        type: String,
        unique: true,
        required: [true, "El nombre Empresa es Necesario"]
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    fotourl: {
        type: String,
        required: false

    },
    ubicacion: {
        type: [Number],
        required: false

    },
    fechaCompraLicencia: {
        type: Date,
        default: Date.now,


    },
    fechaVencimientoLicencia: {
        type: Date,
        required: false


    },

    usuarioADMINISTRADOR: {
        type: Schema.Types.ObjectId,
        required: [true, "Debe ser Un solo Usuario Administrador por Empresa!"],
        unique: true,
        ref: 'Usuario'
    },

    versionSistemas: Map,
    mapOfString: {
        type: Map,
        of: String


    },


    informacionEmpresa: Map,
    mapOfString: {
        type: Map,
        of: String


    },
    ultimoAcesso: {
        Gmdpto: {
            type: Date,
            required: false

        },
        MovilApp: {
            type: Date,
            required: false
        },
        AppWeb: {
            type: Date,
            required: false
        }
    },

}, {
    timestamps: true,
    versionKey: false
});

empresaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

// version
//versionSistemas {"Gmdpto" =>"Ver2020","AppMovil=>"1.10","WebGMD"=>"v15"}
/*
// versionSistemas:{
    gmdpto: "ver2020",
    appMOvil: "1.10",
    webGMD: "v15"

}
// UltimoAcesso:{
    gmdpto: 15/12/2020,
    appMOvil: 16/12/2020,
    webGMD: 16/12/2020

}
*/
module.exports = mongoose.model("Empresa", empresaSchema);