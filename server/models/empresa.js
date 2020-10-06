// importaciones el schema y model
const { Schema, model } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

// let Schema = mongoose.Schema;
// let empresaSchema = new Schema({



 //definir los campos de la colección y las reglas.

const EmpresaSchema = Schema({
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

// asi para como quiere que apoarezca tu coleccion
// , {  collection: 'hospitales' });

// para validar sobrescibir metodos
EmpresaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe Ser Unico'
});

EmpresaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model( 'Empresa', EmpresaSchema );
//module.exports = mongoose.model("Empresa", empresaSchema);