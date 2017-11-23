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
		var vbidtxt = vbid.toString();
		var vask = data.result.Ask;
		var vasktxt = vask.toString();
		var vlast = data.result.Last;
		var vlasttxt = vlast.toString();
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
	var vhoras = fecha.getHours();
	vhoras = ponerCeros(vhoras);
	var vminutos = fecha.getMinutes();
	vminutos = ponerCeros(vminutos);
	var vsegundos = fecha.getSeconds();
	vsegundos = ponerCeros(vsegundos);
	var vcadena = vhoras + ":" + vminutos + ":" + vsegundos; 
//	console.log( vcadena );
	return vcadena;
}

function ponerCeros(vcadenarellenar) {
	var vcad = vcadenarellenar.toString();
	while (vcad.length < 2)
	{
		vcad = '0' + vcad;
	}
	console.log('\n');
	console.log( vcad.length );
	console.log('\n');
	console.log( vcad );
	return vcad;
}

setInterval(fungetticker, 20000);

//wstream.end();

