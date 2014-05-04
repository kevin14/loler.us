var redis = require('redis'),
    client = null;

// redis.debug_mode = true;


module.exports.client = (function() {
    if (client) {
        return client;
    } else {
        client = redis.createClient(6379,'127.0.0.1');
        client.select(15, redis.print);
        client.on("error", function(err) {
            console.log("Error " + err);
        });
        return client;
    }
})();

module.exports.redis = redis;