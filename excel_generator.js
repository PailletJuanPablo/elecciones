const xl = require('excel4node');
const wb = new xl.Workbook();
const fs = require('fs');
const rp = require('request-promise');

let ubicaciones = JSON.parse(fs.readFileSync('ubicaciones.json'));

const ubicFilt = ubicaciones.filter(ubic => {
  return ubic.clase_ubicacion == 'Establecimiento';
});
let counter = 0;
ubicFilt.map((ubic, i) => {
  const idurl = ubic.id_ubicacion.split('.').join('/');
  const options = {
    url: `https://datosoficiales.com/resultados/${idurl}/GOB.json?callback=foo`,
    json: true
  };
  rp(options)
    .then(function(ubic) {
      const ws = wb.addWorksheet(ubic.descripcion_ubicacion);

      ws.column(1).setWidth(50);
      ws.column(2).setWidth(50);
      ws.column(3).setWidth(50);
      ws.cell(1, 1).string(`Resultados de ${ubic.descripcion_ubicacion}`);
      ws.cell(2, 1).string(`Tipo de ubicación`);
      ws.cell(2, 2).string(ubic.clase_ubicacion);
      ws.cell(3, 1).string('Cantidad de Votantes');
      ws.cell(3, 2).number(ubic.cant_votantes);
      ws.cell(4, 1).string('Porcentaje de Participación');
      ws.cell(4, 2).number(ubic.porcentaje_participacion);
      ws.cell(5, 1).string('Votos válidos');
      ws.cell(5, 2).number(ubic.cant_votos_positivos);
      ws.cell(6, 1).string('');
      ws.cell(7, 1).string('Votos');
      ws.cell(8, 1).string('Lista / Tipo');
      ws.cell(8, 2).string('Cantidad');
      ubic.resultados.map((resultado, i) => {
        ws.cell(i + 9, 1).string(resultado.descripcion_candidatura);
        ws.cell(i + 9, 2).number(resultado.cant_votos);
      });
      counter = counter + 1;
      if (counter == ubicFilt.length - 1) {
        wb.write('establecimientos.xlsx');
      }
    })
    .catch(function(err) {
      console.log(err);
      counter = counter + 1;
      if (counter == ubicFilt.length - 1) {
        wb.write('establecimientos.xlsx');
      }
    });
});
