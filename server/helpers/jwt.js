const jwt = require("jsonwebtoken");

const generarJwt = (usuario) => {
  
    return new Promise((resolve, reject) => {
    const payload = {
      usuario,
    };

    jwt.sign(
      payload,
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("No se Pudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

/*
verify().catch(console.error);
// https://developers.google.com/identity/sign-in/web/backend-auth 
*/

module.exports = {
  generarJwt,
};
