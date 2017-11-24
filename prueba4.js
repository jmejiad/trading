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
		var vask = data.result.Ask;
		var vlast = data.result.Last;
		funescribirarchivo();
	}  	
					 );
}

function funescribirarchivo();
{
	var vbidtxt = funponerCerosDer(vbid.toString(), 10);
	var vasktxt = funponerCerosDer(vask.toString(), 10);
	var vlasttxt = funponerCerosDer(vlast.toString(), 10);
	vcont = vcont + 1;
	var vcontxt = vcont.toString();
	var vhora = funobtenerhora();
	var vlinetxt = (vcontxt + ',' + vhora + ',' + vbidtxt + ',' + vasktxt + ',' + vlasttxt);
	console.log( vlinetxt );
	wstream.write( vlinetxt );
	wstream.write('\n');
}

function funobtenerhora(){ 
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

function funponerCerosIzq(vcad, vlon) {
	while (vcad.length < vlon)
	{
		vcad = '0' + vcad;
	}
	return vcad;
}

function funponerCerosDer(vcad, vlon) {
	while (vcad.length < vlon)
	{
		vcad = vcad + '0';
	}
	return vcad;
}

setInterval(fungetticker, 20000);


//wstream.end();

