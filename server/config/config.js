// ================================
//  Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;


//================================
// Entorno Produción o Desarrollo
//================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//================================
// Vencimiento del Token
//================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
// 48h
process.env.CADUCIDAD_TOKEN = "60h";


//================================
// SEED de Autenticación de JWT
//================================
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";


//================================
// Base de datos 
//================================
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/gmdproducto";
   // urlDB = "mongodb://192.168.16.6:27017/gmdproducto";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;



//================================
// Google client ID 
//================================
process.env.CLIENT_ID = process.env.CLIENT_ID || "966238978116-gb8c8sednlt0706d2a6vlhuk4sskg6nt.apps.googleusercontent.com";