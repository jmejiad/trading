//var bittrex = require('./node.bittrex.api.js');
var bittrex = require('node-bittrex-api');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var vid_op = 1;
var i = 1;
var contbid_sb = 0;
var contask_sb = 0;
var ibuytosell = 0; 
var vbid = 0, vvid1, vdidtxt;
var vask = 0, vask1, vasktxt;
var vaskant = 0;
var vbidant = 0, vbidant2 = 0;
var vlast, vlast1, vlasttxt;
var vaskultcompra = 0.00000000; // valor de ultima compra o recompra
var vaskcompraini = 0.00000000; // valor de primera compra
var vporcesperadorecompra = -0.05;
var vporcesperadoventa = 0.02;
var vporcactual = 0;
var vunicompraini = 100;
var vdiferenciatotalop = 0;
var vdiferenciatotalopacum = 0;
var vuniacumcompra = vunicompraini;
var vprofoper = 0;
var vaccion = '';
var vestado_op = 0;
var vcliente = 'Jose Mejia';
var vspread, vid_opant, vmercado = 'BTC-MANA', vtipo_op, vvalorultcompra, vacumcompra;
var vuniavender, vvaloravender, vvalorarecomprar, vuniarecomprar, vunivendidas, vvalorventa, vdiferenciavc;
var	vacumcompra = 0;
var	vvalorultcompra = 0;

{

	bittrex.options({
	  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
	  'apisecret' : '8af924252c8a4947b520a01607c5daea',
	});

	wstream.write( 'Numero, Hora, Bid, Ask, Last, vbidant, vbidant2, vbid>vbidant, vbidant<vbidant2, vprofoper, contbid_sb, contask_sb, vaskultcompra, vdiferenciavc, vporcactual, vporcesperadorecompra, vporcesperadoventa, vvalorultcompra, vuniacumcompra, vacumcompra, vvalorventa, vdiferenciatotalop, vdiferenciatotalopacum' );
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
		vaskant = vask;
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
	console.log('vestado_op:            ' + vestado_op);
	console.log('vask:                  ' + vask);
	console.log('vaskant:               ' + vaskant);
	console.log('vbid:                  ' + vbid);
	console.log('vbidant:               ' + vbidant);
	console.log('vbidant2:              ' + vbidant2);

	if (vask > vaskant) {
		console.log('\033[32mvask Sube','\033[0m');
		contask_sb = (contask_sb + 1);
	}	else if (vask < vaskant) {
			console.log('\033[31mvask Baja','\033[0m');
			contask_sb = (contask_sb - 1);
		}	else {
				console.log('vask Igual');
			}

	if (vbid > vbidant) {
		console.log('\033[32mvbid Sube','\033[0m');
		contbid_sb = (contbid_sb + 1);
	}	else if (vbid < vbidant) {
			console.log('\033[31mvbid Baja','\033[0m');
			contbid_sb = (contbid_sb - 1);
		}	else {
				console.log('vbid Igual');
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

			console.log('vprofoper:             ' + vprofoper);
			console.log('contbid_sb:            ' + contbid_sb);
			console.log('contask_sb:            ' + contask_sb);
			console.log('vbid:                  ' + vbid);
			console.log('vask:                  ' + vask);
			console.log('vaskcompraini:         ' + vaskcompraini);
			console.log('vaskultcompra:         ' + vaskultcompra);
			console.log('vdiferenciavc:         ' + vdiferenciavc);
			console.log('vporcactual:           ' + vporcactual);
			console.log('vporcesperadorecompra: ' + vporcesperadorecompra);
			console.log('vporcesperadoventa:    ' + vporcesperadoventa);
			console.log('vuniacumcompra:        ' + vuniacumcompra);
			console.log('vvalorultcompra:       ' + vvalorultcompra);
			console.log('vacumcompra:           ' + vacumcompra);
			if (vdiferenciatotalopacum < 0){
				console.log('\033[31mvdiferenciatotalopacum:' + vdiferenciatotalopacum, '\033[0m');
			} else if (vdiferenciatotalopacum > 0){
				console.log('\033[32mvdiferenciatotalopacum:' + vdiferenciatotalopacum, '\033[0m');
				}
				else{
					console.log('vdiferenciatotalopacum:' + vdiferenciatotalopacum);
				}
			}

			if (vporcactual < vporcesperadorecompra) {
				funcompra();
				console.log('\033[31mAcción: Recomprar','\033[0m');
				//console.log('Acción: Recomprar');
			} else if (vporcactual >= vporcesperadoventa) {
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
	vvaloravender = vvalorultcompra * (vporcesperadoventa + 1);
	vvalorarecomprar = vvalorultcompra - (vvalorultcompra * vporcesperadorecompra);
	vuniarecomprar = vuniacumcompra;
	ibuytosell = 1;
	contbid_sb = 0;
	contask_sb = 0;


}
function funventa()
{
	vestado_op = 0;
	vaskcompraini = 0;
	vvalorventa = vuniacumcompra * vbid;
	vdiferenciatotalop = vvalorventa - vacumcompra;
	vdiferenciatotalopacum = vdiferenciatotalopacum + vdiferenciatotalop;
	vacumcompra = 0;
	console.log('vvalorventa:           ' + vvalorventa);
	
	if (vdiferenciatotalop < 0){
		console.log('\033[31mvdiferenciatotalop:    ' + vdiferenciatotalop, '\033[0m');
	} else {
		console.log('\033[32mvdiferenciatotalop:    ' + vdiferenciatotalop, '\033[0m');
	}
	
	if (vdiferenciatotalopacum < 0){
		console.log('\033[31mvdiferenciatotalopacum:' + vdiferenciatotalopacum, '\033[0m');
	} else {
		console.log('\033[32mvdiferenciatotalopacum:' + vdiferenciatotalopacum, '\033[0m');
	}
	vuniacumcompra = vunicompraini;
	vprofoper = 0;
	i = 0;
	vid_op = vid_op + 1;
	ibuytosell = 1;
	contbid_sb = 0;
	contask_sb = 0;

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
	var vcontbid_sbtxt = String(contbid_sb);
	var vcontask_sbtxt = String(contask_sb);
	var vaskultcompratxt = String(vaskultcompra);
	var vdiferenciavctxt = String(vdiferenciavc);
	var vdiferenciatotaloptxt = String(vdiferenciatotalop);
	var vdiferenciatotalopacumtxt = String(vdiferenciatotalopacum);
	var vporcactualtxt = String(vporcactual);
	var vporcesperadorecompratxt = String(vporcesperadorecompra);
	var vporcesperadoventatxt = String(vporcesperadoventa);
	var vvalorultcompratxt = String(vvalorultcompra);
	var vuniacumcompratxt = String(vuniacumcompra);
	var vlinetxt = (itxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt + ',' + String(vbidant) + ',' + String(vbidant2) + ',' + vcambio1 + ',' + vcambio2 + ',' + vprofopertxt + ',' + vcontbid_sbtxt + ',' + vcontask_sbtxt + ',' + vaskultcompratxt + ',' + vdiferenciavctxt + ',' + vporcactualtxt + ',' + vporcesperadorecompratxt + ',' + vporcesperadoventatxt + ',' + vvalorultcompratxt + ',' + vuniacumcompratxt + ',' + vacumcompra + ',' + vvalorventa + ',' + vdiferenciatotaloptxt + ',' + vdiferenciatotalopacumtxt);
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

