const config     = require('../config.js');
var Twitter = require('twitter'),
    fs = require('fs');
var jsonfile = require('jsonfile')

//, callback
let getTweetsByWord = (word, callback) => {

  var client = new Twitter({
    consumer_key: `${config.consumer_key}`,
    consumer_secret: `${config.consumer_secret}`,
    access_token_key: `${config.access_token_key}`,
    access_token_secret: `${config.access_token_secret}`
  });

  console.log(client);

  client.get('search/tweets', {q: `${word}`}, function(error, tweets, response) {
    // console.log(tweets);
    callback(tweets);
  });

}


module.exports.getTweetsByWord = getTweetsByWord;
