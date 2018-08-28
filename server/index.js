var TweetMongo = require('./../database-mongo/index.js');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var twitter = require('./../helpers/getTweetsFromTwitter')
const fs = require('fs');
const port = process.env.PORT || 3004;
const toneAnalyzer = require('./../helpers/getSentimentsFromIBM');
const watsonCredentials = require('./../IBMWatsonCredentials.js');

//use body-parser
app.use(bodyParser.json());

//serve static files
app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/tweets', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.txt'), 'utf8', function(err, data) {
    if(err) throw err;
    var array = data.toString().split(",");
    res.json(array)
  });
});

app.post('/tweets', (req, res) => {
//  post to server database needs helper function to make API request to Twitter;
    var word = req.body.word;
    console.log(req.body, 'Tha body');
    twitter.getTweetsByWord(word, (tweets)=>{
    console.log('getting tweets from', word);
    var file = 'data.txt'
    word = JSON.stringify(word);
    TweetMongo.Tweet.create({word:word, number_of_tweets:100})
    var tweetsArray = tweets.statuses;
    console.log('twets array',tweetsArray);
    
    //clean file
    fs.writeFile(file, '', function (err) {
            console.log('writing to file')
            console.error(err)
    });

    tweetsArray.forEach(function(tweet){
      var temp = JSON.stringify(tweet.text)
      var params = {
      'textToAnalyze': temp,
      'username': watsonCredentials.watsonCredentials.username,
      'password': watsonCredentials.watsonCredentials.password,
      'use_unauthenticated' : false
      }
      //pending change when word changes, reset the file
      toneAnalyzer.getSentiment(function(result) {
        if(result[0] || result[0]!== undefined){
          fs.appendFile(file, JSON.stringify(result[0].tone_id)+' '+JSON.stringify(result[0].score)+',', function (err) {
            console.log('writing to file')
            console.error(err)
          });  
        }
      }, params)
    });
     res.status(201).send(); 
  })
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
