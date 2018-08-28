function main(params) {
  return new Promise(function (resolve, reject) {
    var res = {};
    const ToneAnalyzerV3 =
      require('watson-developer-cloud/tone-analyzer/v3');

    var url = params.url || 'https://gateway.watsonplatform.net/tone-analyzer/api/' ;
    var use_unauthenticated =  params.use_unauthenticated || false ;

    const tone_analyzer = new ToneAnalyzerV3({
      'username': params.username,
      'password': params.password,
      'version_date': '2017-09-21',
      'url' : url,
      'use_unauthenticated': false
    });

    tone_analyzer.tone({'text': params.textToAnalyze}, function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
  resArray.push(promise);
}

var getSentiment = function(callback, params){
  var resArray = [];
  main(params)
    .then((results) => {
      callback(results.document_tone.tones);
    })
    .catch((error) => console.log(error.message));
}
  
module.exports.getSentiment = getSentiment;


// getSentiment(console.log);
