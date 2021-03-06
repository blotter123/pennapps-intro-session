// Generated by CoffeeScript 1.3.3
var all_help_requests, redis, redis_db, redis_password, redis_url, store_help_request, url, _ref, _ref1;

url = require('url');

redis_url = url.parse((_ref = process.env.REDISTOGO_URL) != null ? _ref : 'redis://localhost:6300');

redis = (require('redis')).createClient(redis_url.port, redis_url.hostname);

if (redis_url.auth) {
  _ref1 = redis_url.auth.split(':'), redis_db = _ref1[0], redis_password = _ref1[1];
  redis.auth(redis_password);
}

store_help_request = function(request) {
  var id;
  id = redis.incr('help_request_count');
  request.id = id;
  return redis.lpush('help_requests', JSON.stringify(request));
};

all_help_requests = function(callback) {
  return redis.lrange('help_requests', 0, -1, function(err, requests) {
    var r;
    if (err != null) {
      return callback(err);
    } else {
      return callback(null, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = requests.length; _i < _len; _i++) {
          r = requests[_i];
          _results.push(JSON.parse(r));
        }
        return _results;
      })());
    }
  });
};

module.exports = {
  store_help_request: store_help_request,
  all_help_requests: all_help_requests
};
