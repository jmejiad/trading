var bittrex = require('./node.bittrex.api.js');
var fs = require('fs');
var wstream = fs.createWriteStream('Ticker_Log.csv');
wstream.write( 'Bid, Ask, Last' );
wstream.write('\n');

function fungetticker()
{
	bittrex.getticker( { market : 'BTC-ETH' }, function( data, err ) 
	{	
		let vbid = data.result.Bid;
		let vbidtxt = vbid.toString();
		let vask = data.result.Ask;
		let vasktxt = vask.toString();
		let vlast = data.result.Last;
		let vlasttxt = vlast.toString();
		let vlinetxt = vbidtxt + ',' + vasktxt + ',' + vlasttxt;
		console.log( vlinetxt );
		wstream.write( vlinetxt );
		wstream.write('\n');
	}  	
					 );
}

setInterval(fungetticker, 20000);

//wstream.end();

