const jwt = require("jsonwebtoken");

const generarJwt = (usuario)=>{
   

    return new Promise((resolve,reject)=>{

        const payload = {
          usuario
           
        };
    
        jwt.sign(payload,process.env.SEED,
                { expiresIn: process.env.CADUCIDAD_TOKEN },(error,token)=>{
    
                    if(error) {
                        console.log(error);
                        reject('No se Pudo generar el JWT');
                    } else {
                        resolve(token);
                    }
    
    
                });
            
    

    });
 
    
}

/*

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    //console.log(payload);
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
verify().catch(console.error);
// https://developers.google.com/identity/sign-in/web/backend-auth
//  me quede en video 3 seccion 11
// 
*/
module.exports ={
    generarJwt
}

