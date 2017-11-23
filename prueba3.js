var bittrex = require('./node.bittrex.api.js');
bittrex.getbalance({ currency : 'BTC' }, function( data, err ) {
  if (err) {
    return console.error(err);
  }
  console.log( data );
});