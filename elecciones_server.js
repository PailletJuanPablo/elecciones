var express = require('express');
var app = express();
const rp = require('request-promise');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
  res.header('Allow', 'GET, POST, PUT,DELETE');
  next();
});

let puerto = 1234;

app.listen(process.env.PORT || puerto, () => {
  console.log('Servidor corriendo en puerto: ' + puerto);
});

app.get('/', async (req, res) => {
    if(!req.query.idUrl){
      return res.send({ok: true})
    }
    const idUrl = req.query.idUrl;
    const url = `https://datosoficiales.com/resultados/${idUrl}/GOB.json`;
    const options = {
        url,
        json: true
    };
    try {
        const data = await rp(options);
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
})