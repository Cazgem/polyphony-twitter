var Twitter = require('twitter');
const config = require(`./config.js`);
var client = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});
var stream = client.stream('statuses/filter', { track: 'citiesskylines, citiesinasnap, paradoxinteractive, skylinesnews7, cazgem, PolyphonyTwitch' });
stream.on('data', function (tweet) {
    if (tweet.user['name'] === 'PolyphonyTwitch') {
        console.log(tweet.user['name'] + ': ' + tweet.text);
    } else {
        if ((tweet.user[`name`] === `Cazgem`) && (tweet.text.includes('@PolyphonyTwitch'))) {
            client.post(`statuses/retweet/${tweet.id_str}`, function (error, tweet2, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(tweet.user['name'] + ': ' + tweet.text);
                }
            })
        } else {
            console.log(tweet.user['name'] + ': ' + tweet.text);
        }
    }
});

stream.on('error', function (error) {
    console.log(error);
});

var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    let msg = d.toString().trim(); //Don't listen to my own message
    let params = msg.slice(1).split(' '); // Remove whitespace from chat message Skip the "!" and split every word into an array 
    let cname = params.shift().toLowerCase(); // let channelname = channel.slice(1); The first parameter can be removed and lowercased for the command name
    if (cname === `tweet`) {
        client.post('statuses/update', { status: `${msg.slice(6)}` }, function (error, tweet, response) {
            if (error) throw error;
            // console.log(tweet);  // Tweet body.
        });
    }
});
