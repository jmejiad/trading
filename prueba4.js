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
	var cadena = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds(); 
//	console.log( cadena );
	return cadena;
}

setInterval(fungetticker, 20000);

//wstream.end();

