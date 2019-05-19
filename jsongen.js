const xl = require('excel4node');
const wb = new xl.Workbook();
const fs = require('fs');
const rp = require('request-promise');
let ubicaciones = JSON.parse(fs.readFileSync('ubicaciones.json'));  
const ubicFilt = ubicaciones;
ubicFilt.map((ubic) => {
    if(!fs.existsSync('jsons/'+ubic.id_ubicacion+'.json')) {
        const idurl = ubic.id_ubicacion.split('.').join('/');
        const options = {
            url: `https://datosoficiales.com/resultados/${idurl}/GOB.json`,
            json: true
        };
        rp(options)
        .then(function (ubic) {
            fs.writeFileSync('jsons/'+ubic.id_ubicacion+'.json', ubic, 'utf8');
            console.log('write ok')
        })
        .catch(function (err) {
            console.log(`https://datosoficiales.com/resultados/${idurl}/GOB.json`);
        });
    }
})


