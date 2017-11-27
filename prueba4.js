//var bittrex = require('./node.bittrex.api.js');
var bittrex = require('node-bittrex-api');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var i = 0;
var vbid, vvid1, vdidtxt;
var vask = 0, vask1, vasktxt;
var vaskant = 0, vaskant2 = 0;
var vlast, vlast1, vlasttxt;
var vaskcompra = 0.00000000;
var vporcesperado = 0.01;
var vporcactual = 0;
var vunicompraini = 100;
var vuniacumcompra = vunicompraini;
var vprofoper = 0;
var vaccion = '';
var vestado_op = 0;
var vcliente = 'Jose Mejia';
var vspread, vid_op, vid_opant, vmercado = 'BTC-ETH', vtipo_op, vvalorcompra, vacumcompra;
var vuniavender, vvaloravender, vvalorarecomprar, vuniarecomprar, vunivendidas, vvalorventa, vdiferenciavc;

{

	bittrex.options({
	  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
	  'apisecret' : '8af924252c8a4947b520a01607c5daea',
	});

	wstream.write( 'Numero, Hora, Bid, Ask, Last, Accion' );
	wstream.write('\n');
	vacumcompra = 0;
	vvalorcompra = 0;
	vid_op = 0;
	//funtraerdatosbd();
	setInterval(fungetticker, 5000);
}


function fungetticker()
{
	bittrex.getticker( { market : vmercado }, function( data, err ) 
	{	
		if (err) {
    		return console.error(err);
  		} 
		vbid1 = data.result.Bid;
		vask1 = data.result.Ask;
		vlast1 = data.result.Last;
		vbid = Number(vbid1);
		vaskant2 = vaskant;
		vaskant = vask;
		vask = Number(vask1);
		vlast = Number(vlast1);
		vbidtxt = funponerCerosDer(vbid.toString(), 10);
		vasktxt = funponerCerosDer(vask.toString(), 10);
		vlasttxt = funponerCerosDer(vlast.toString(), 10);
		funcalculardatos();
		funoperacion();
		funescribirarchivo();
	}  	
					);
}

function funoperacion()
{
	console.log('vestado_op: ' + vestado_op);
	if (vestado_op = 0){ // si no hay operacion abierta
		if ((vask > vaskant) && (vaskant < vaskant2)) { // si baja el precio y luego sube, y no hay operación abierta, hay que comprar 
			vestado_op = 1;
			vaccion = 'Comprar';
			//funcompra();
		}
	} else {
		vdiferenciavc = (vbid - vaskcompra) * vuniacumcompra;
		vporcactual = (vdiferenciavc / vvalorcompra);
		console.log('vaskcompra: ' + vaskcompra);
		console.log('vdiferenciavc: ' + vdiferenciavc);
		console.log('vporcactual: ' + vporcactual);
		console.log('vporcesperado: ' + vporcesperado);
		console.log('vuniacumcompra: ' + vuniacumcompra);

		if (vporcactual > vporcesperado || vporcactual < -vporcesperado) {
			if (vporcactual > vporcesperado) {
				//funcompra();
				vaccion = 'Recomprar';
			} else if (vporcactual < -vporcesperado) {
				//funventa();
				vaccion = 'Vender';
			}
		}
	}
}

function funcompra()
{
	vaskcompra = vask;
	vvalorcompra = vuniacumcompra * vask;
	vacumcompra = vacumcompra + vvalorcompra;
	vprofoper = vprofoper + 1;
	// llamar aqui la funcion de compra: parametros : vuniacumcompra, vvalorcompra.
	// llamado funcion
	if (vprofoper > 1) {
		vuniacumcompra = vuniacumcompra + vuniacumcompra;
	}
	vvaloravender = vvalorcompra * (vporcesperado + 1);
	vvalorarecomprar = vvalorcompra - (vvalorcompra * vporcesperado);
	vuniarecomprar = vuniacumcompra;

}
function funventa()
{
	vestado_op = 0;
	vid_opant = vid_op;
	vacumcompra = 0;
	vuniacumcompra = vunicompraini;

}

function funcalculardatos()
{
	vspread = vask - vbid;
	vid_op = i; // buscar en base de datos el id de la operacion abierta, si no hay ninguna, traer un nuevo id_op.
	//vestado_op = 0;
	vtipo_op = 'Compra'; // traer el tipo de op de la base de datos. si no hay op abierta, el tipo de op será 'compra'.
	vunicompradas = 100; // traer de la base de datos el numero de unidades a comprar para este cliente en este mercado.
	vvalorcompra = vask;
	vacumcompra = vacumcompra + vvalorcompra; // traer el valor acumulado de esta operacion de la base de datos.
}

//function funtraerdatosbd()
// Función que al arrancar la ejecución del programa busca en base de datos el estado de la operación actual
// y trae los mismos valores de funcalculardatos.
	//null;
//{

//}

function funescribirarchivo()
{
	i = i + 1;
	var itxt = i.toString();
	var vhora = funobtenerhora();
	var vlinetxt = (itxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt + ',' + vaccion);
	console.log( vlinetxt );
	console.log('vestado_op: ' + vestado_op);
	console.log('vask: ' + vask);
	console.log('vaskant: ' + vaskant);
	console.log('vaskant2: ' + vaskant2);
	wstream.write( vlinetxt );
	wstream.write('\n');
}

function funobtenerhora()
{ 
	var fecha = new Date();
	var vhoras = fecha.getHours().toString();
	vhoras = funponerCerosIzq(vhoras, 2);
	var vminutos = fecha.getMinutes().toString();
	vminutos = funponerCerosIzq(vminutos, 2);
	var vsegundos = fecha.getSeconds().toString();
	vsegundos = funponerCerosIzq(vsegundos, 2);
	var vcadena = vhoras + ":" + vminutos + ":" + vsegundos; 
//	console.log( vcadena );
	return vcadena;
}

function funponerCerosIzq(vcad, vlon) 
{
	while (vcad.length < vlon)
	{
		vcad = '0' + vcad;
	}
	return vcad;
}

function funponerCerosDer(vcad, vlon) 
{
	while (vcad.length < vlon)
	{
		vcad = vcad + '0';
	}
	return vcad;
}



//wstream.end();

