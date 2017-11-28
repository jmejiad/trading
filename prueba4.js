//var bittrex = require('./node.bittrex.api.js');
var bittrex = require('node-bittrex-api');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var i = 1;
var contsb = 0;
var ibuytosell = 0; 
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
var vspread, vid_op, vid_opant, vmercado = 'BTC-NEO', vtipo_op, vvalorcompra, vacumcompra;
var vuniavender, vvaloravender, vvalorarecomprar, vuniarecomprar, vunivendidas, vvalorventa, vdiferenciavc;

{

	bittrex.options({
	  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
	  'apisecret' : '8af924252c8a4947b520a01607c5daea',
	});

	wstream.write( 'Numero, Hora, Bid, Ask, Last' );
	wstream.write('\n');
	vacumcompra = 0;
	vvalorcompra = 0;
	vid_op = 0;
	//funtraerdatosbd();
	setInterval(fungetticker, 15000);
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
		vlast = Number(vlast1);
		vaskant2 = vaskant;
		vaskant = vask;
		vask = Number(vask1);
		vbidtxt = funponerCerosDer(vbid.toString(), 10);
		vasktxt = funponerCerosDer(vask.toString(), 10);
		vlasttxt = funponerCerosDer(vlast.toString(), 10);
		vaccion = '';
		funoperacion();
		//funescribirarchivo();
		i = i + 1;
	}  	
					);
}

function funoperacion()
{
	console.log('\n');
	//console.log('------ INICIO -----');
	console.log('\033[47m','\033[30m','Iteracion: ' + i,'\033[0m');
	console.log('vestado_op:         ' + vestado_op);
	console.log('vbid:               ' + vbid);
	console.log('vask:               ' + vask);
	console.log('vaskant:            ' + vaskant);
	console.log('vaskant2:           ' + vaskant2);
	console.log('vask > vaskant:     ' + (vask > vaskant));
	console.log('vaskant < vaskant2: ' + (vaskant < vaskant2));
	if (vask > vaskant) {
		console.log('\033[32m','Sube','\033[0m');
		contsb = (contsb + 1);
	}	else if (vask < vaskant) {
			console.log('\033[31m','Baja','\033[0m');
			contsb = (contsb - 1);
		}	else {
				console.log('Igual');
			}
	
	if (i > 2){
		if (vestado_op == 0){ // si no hay operacion abierta
			if ((vask > vaskant) && (vaskant < vaskant2)) { // si baja el precio y luego sube, y no hay operación abierta, hay que comprar 
				vestado_op = 1;
				//console.log('Acción: Comprar');
				console.log('\033[33m','Acción: Comprar','\033[0m');
				funcompra();
			}
		} else {
//			if (vprofoper == 1) {
//				vdiferenciavc = (vbid - vask) * vuniacumcompra;
//			} else {
			vdiferenciavc = (vbid - vaskcompra) * vuniacumcompra;
//			}
			vporcactual = (vdiferenciavc / vvalorcompra);
			console.log('vprofoper:          ' + vprofoper);
			console.log('contsb:             ' + contsb);
			console.log('vbid:               ' + vbid);
			console.log('vask:               ' + vask);
			console.log('vaskcompra:         ' + vaskcompra);
			console.log('vdiferenciavc:      ' + vdiferenciavc);
			console.log('vporcactual:        ' + vporcactual);
			console.log('vvalorcompra:       ' + vvalorcompra);
			console.log('vporcesperado:      ' + vporcesperado);
			console.log('vuniacumcompra:     ' + vuniacumcompra);
			if (vporcactual < -vporcesperado) {
				funcompra();
				console.log('\033[31m','Acción: Recomprar','\033[0m');
				//console.log('Acción: Recomprar');
			} else if (vporcactual > vporcesperado) {
				funventa();
				console.log('\033[32m','Acción: Vender','\033[0m');
				//console.log('Acción: Vender');
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
	ibuytosell = 1;
	contsb = 0;


}
function funventa()
{
	vestado_op = 0;
	vid_opant = vid_op;
	vid_op = vid_op + 1;
	vacumcompra = 0;
	vuniacumcompra = vunicompraini;
	vprofoper = 1;
	i = 0;
	ibuytosell = 1;
	contsb = 0;

}

function funescribirarchivo()
{
	var itxt = i.toString();
	var vhora = funobtenerhora();
	var vlinetxt = (itxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt);
	console.log( vlinetxt );
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

