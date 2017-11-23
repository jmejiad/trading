
var bittrex = require('node-bittrex-api');
bittrex.options({
  'apikey' : 'c9bb8f0994634d92acf050acd899c173',
  'apisecret' : '8af924252c8a4947b520a01607c5daea',
});
bittrex.getbalance({ currency : 'BTC' }, function( data, err ) {
  if (err) {
    return console.error(err);
  }
  console.log( data );
});



