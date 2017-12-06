//var bittrex = require('./node.bittrex.api.js');
var bittrex = require('node-bittrex-api');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var vid_op = 1;
var i = 1;
var contsb = 0;
var ibuytosell = 0; 
var vbid, vvid1, vdidtxt;
var vask = 0, vask1, vasktxt;
var vbidant = 0, vbidant2 = 0;
var vlast, vlast1, vlasttxt;
var vaskultcompra = 0.00000000; // valor de ultima compra o recompra
var vaskcompraini = 0.00000000; // valor de primera compra
var vporcesperado = 0.01;
var vporcactual = 0;
var vunicompraini = 100;
var vdiferenciavcacum = 0;
var vuniacumcompra = vunicompraini;
var vprofoper = 0;
var vaccion = '';
var vestado_op = 0;
var vcliente = 'Jose Mejia';
var vspread, vid_opant, vmercado = 'BTC-GBG', vtipo_op, vvalorultcompra, vacumcompra;
var vuniavender, vvaloravender, vvalorarecomprar, vuniarecomprar, vunivendidas, vvalorventa, vdiferenciavc;
var	vacumcompra = 0;
var	vvalorultcompra = 0;

{

	bittrex.options({
	  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
	  'apisecret' : '8af924252c8a4947b520a01607c5daea',
	});

	wstream.write( 'Numero, Hora, Bid, Ask, Last, vbidant, vbidant2, vbid>vbidant, vbidant<vbidant2, vprofoper, contsb, vaskultcompra, vdiferenciavc, vporcactual, vporcesperado, vvalorultcompra, vuniacumcompra, vacumcompra, vvalorventa' );
	wstream.write('\n');
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
		vbidant2 = vbidant;
		vbidant = vbid;
		vask = Number(vask1);
		vbid = Number(vbid1);
		vlast = Number(vlast1);
		vbidtxt = funponerCerosDer(vbid.toString(), 10);
		vasktxt = funponerCerosDer(vask.toString(), 10);
		vlasttxt = funponerCerosDer(vlast.toString(), 10);
		vaccion = '';
		funoperacion();
		funescribirarchivo();
		i = i + 1;
	}  	
					);
}

function funoperacion()
{
	console.log('\n');
	//console.log('------ INICIO -----');
	console.log('\033[47m\033[30mIteracion:' + vid_op + '.' + i, '\033[0m');
	console.log('vestado_op:         ' + vestado_op);
	console.log('vask:               ' + vask);
	console.log('vbid:               ' + vbid);
	console.log('vbidant:            ' + vbidant);
	console.log('vbidant2:           ' + vbidant2);
	console.log('vbid > vbidant:     ' + (vbid > vbidant));
	console.log('vbidant < vbidant2: ' + (vbidant < vbidant2));
	if (vbid > vbidant) {
		console.log('\033[32mSube','\033[0m');
		contsb = (contsb + 1);
	}	else if (vbid < vbidant) {
			console.log('\033[31mBaja','\033[0m');
			contsb = (contsb - 1);
		}	else {
				console.log('Igual');
			}
	
	if (i > 2){
		if (vestado_op == 0){ // si no hay operacion abierta
			if ((vbid > vbidant) && (vbidant < vbidant2)) { // si baja el precio y luego sube, y no hay operación abierta, hay que comprar 
				vestado_op = 1;
				//console.log('Acción: Comprar');
				console.log('\033[33mAcción: Comprar','\033[0m');
				funcompra();
			}
		} else {

			vdiferenciavc = (vbid - vaskultcompra) * vuniacumcompra;
			vporcactual = (vdiferenciavc / vvalorultcompra);

			console.log('vprofoper:          ' + vprofoper);
			console.log('contsb:             ' + contsb);
			console.log('vbid:               ' + vbid);
			console.log('vask:               ' + vask);
			console.log('vaskcompraini:      ' + vaskcompraini);
			console.log('vaskultcompra:      ' + vaskultcompra);
			console.log('vdiferenciavc:      ' + vdiferenciavc);
			console.log('vporcactual:        ' + vporcactual);
			console.log('vporcesperado:      ' + vporcesperado);
			console.log('vuniacumcompra:     ' + vuniacumcompra);
			console.log('vvalorultcompra:    ' + vvalorultcompra);
			console.log('vacumcompra:        ' + vacumcompra);
			if (vporcactual < -vporcesperado) {
				funcompra();
				console.log('\033[31mAcción: Recomprar','\033[0m');
				//console.log('Acción: Recomprar');
			} else if (vporcactual > vporcesperado) {
				funventa();
				console.log('\033[32mAcción: Vender','\033[0m');
				//console.log('Acción: Vender');
			}
		}
	}
}

function funcompra()
{
	vaskultcompra = vask;
	vvalorultcompra = vuniacumcompra * vask;
	vacumcompra = vacumcompra + vvalorultcompra;
	vprofoper = vprofoper + 1;
	// llamar aqui la funcion de compra: parametros : vuniacumcompra, vvalorultcompra.
	// llamado funcion
	if (vprofoper > 1) {
		vuniacumcompra = vuniacumcompra + vuniacumcompra;
	}else if (vprofoper <= 1) {
		vaskcompraini = vask;
	}
	vvaloravender = vvalorultcompra * (vporcesperado + 1);
	vvalorarecomprar = vvalorultcompra - (vvalorultcompra * vporcesperado);
	vuniarecomprar = vuniacumcompra;
	ibuytosell = 1;
	contsb = 0;


}
function funventa()
{
	vestado_op = 0;
	vacumcompra = 0;
	vaskcompraini = 0;
	vdiferenciavcacum = vdiferenciavcacum + vdiferenciavc;
	vvalorventa = vuniacumcompra * vbid;
	console.log('\033[32mvvalorventa:        ' + vvalorventa, '\033[0m');
	console.log('\033[32mvdiferenciavcacum:  ' + vdiferenciavcacum, '\033[0m');
	vuniacumcompra = vunicompraini;
	vprofoper = 0;
	i = 0;
	vid_op = vid_op + 1;
	ibuytosell = 1;
	contsb = 0;

}

function funescribirarchivo()
{
	var itxt = i.toString();
	
	var vhora = funobtenerhora();
	if (vbid>vbidant) {
		var vcambio1 = 'true';
	}else {
		var vcambio1 = 'false'
	}

	if (vbidant<vbidant2) {
		var vcambio2 = 'true';
	}else {
		var vcambio2 = 'false'
	}

	var vprofopertxt = String(vprofoper); 
	var vcontsbtxt = String(contsb);
	var vaskultcompratxt = String(vaskultcompra);
	var vdiferenciavctxt = String(vdiferenciavc);
	var vporcactualtxt = String(vporcactual);
	var vporcesperadotxt = String(vporcesperado);
	var vvalorultcompratxt = String(vvalorultcompra);
	var vuniacumcompratxt = String(vuniacumcompra);
	var vlinetxt = (itxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt + ',' + String(vbidant) + ',' + String(vbidant2) + ',' + vcambio1 + ',' + vcambio2 + ',' + vprofopertxt + ',' + vcontsbtxt + ',' + vaskultcompratxt + ',' + vdiferenciavctxt + ',' + vporcactualtxt + ',' + vporcesperadotxt + ',' + vvalorultcompratxt + ',' + vuniacumcompratxt + ',' + vacumcompra + ',' + vvalorventa);
	//console.log( vlinetxt );
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

