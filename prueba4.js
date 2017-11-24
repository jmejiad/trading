var bittrex = require('./node.bittrex.api.js');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
var vcont = 0;

wstream.write( 'Numero, Hora, Bid, Ask, Last' );
wstream.write('\n');

function fungetticker()
{
	bittrex.getticker( { market : 'BTC-ETH' }, function( data, err ) 
	{	
		var vbid = data.result.Bid;
		var vbidtxt = ponerCerosDer(vbid.toString(), 10);
		var vask = data.result.Ask;
		var vasktxt = ponerCerosDer(vask.toString(), 10);
		var vlast = data.result.Last;
		var vlasttxt = ponerCerosDer(vlast.toString(), 10);
		vcont = vcont + 1;
		var vcontxt = vcont.toString();
		var vhora = obtenerhora();
		var vlinetxt = (vcontxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt);
		console.log( vlinetxt );
		wstream.write( vlinetxt );
		wstream.write('\n');
	}  	
					 );
}

function obtenerhora(){ 
	var fecha = new Date();
	var vhoras = fecha.getHours().toString();
	vhoras = ponerCerosIzq(vhoras, 2);
	var vminutos = fecha.getMinutes().toString();
	vminutos = ponerCerosIzq(vminutos, 2);
	var vsegundos = fecha.getSeconds().toString();
	vsegundos = ponerCerosIzq(vsegundos, 2);
	var vcadena = vhoras + ":" + vminutos + ":" + vsegundos; 
//	console.log( vcadena );
	return vcadena;
}

function ponerCerosIzq(vcad, vlon) {
	while (vcad.length < vlon)
	{
		vcad = '0' + vcad;
	}
	return vcad;
}

function ponerCerosDer(vcad, vlon) {
	while (vcad.length < vlon)
	{
		vcad = vcad + '0';
	}
	return vcad;
}

setInterval(fungetticker, 20000);

//wstream.end();

