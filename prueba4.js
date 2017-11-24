//var bittrex = require('./node.bittrex.api.js');
var bittrex = require('node-bittrex-api');
bittrex.options({
  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
  'apisecret' : '8af924252c8a4947b520a01607c5daea',
});
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var i = 0;
var vbid, vdidtxt;
var vask, vasktxt;
var vlast, vlasttxt;
var vcliente = 'Jose Mejia';
var vspread, vid_op, vmercado = 'BTC-ETH', vestado_op, vtipo_op, vunicompradas, vvalorcompra, vacumcompra, vprofoper;
var vuniavender, vvaloravender, vvalorarecomprar, vuniarecomprar, vunivendidas, vvalorventa, vdiferenciavc, vporcentajedifvc;

{
	wstream.write( 'Numero, Hora, Bid, Ask, Last' );
	wstream.write('\n');
	setInterval(fungetticker, 5000);
}


function fungetticker()
{
	bittrex.getticker( { market : vmercado }, function( data, err ) 
	{	
		if (err) 
		{
    		return console.error(err);
  		}
		vbid = data.result.Bid;
		vask = data.result.Ask;
		vlast = data.result.Last;
		vbidtxt = funponerCerosDer(vbid.toString(), 10);
		vasktxt = funponerCerosDer(vask.toString(), 10);
		vlasttxt = funponerCerosDer(vlast.toString(), 10);
		funcalculardatos();
		funescribirarchivo();
	}  	
					 );
}
function funcalculardatos()
{
	vspread = vask - vbid;
	vid_op = i; // buscar en base de datos el id de las operaciones abiertas, si no hay ninguna, traer un nuevo id_op.
	vestado_op = 'Abierta';
	vtipo_op = 'Compra'; // traer el tipo de op de la base de datos. si no hay op abierta, el tipo de op será 'compra'.
	vunicompradas = 100; // traer de la base de datos el numero de unidades a comprar para este cliente en este mercado.


}
function funescribirarchivo()
{
	i = i + 1;
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

