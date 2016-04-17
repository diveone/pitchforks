var env = require('../server');

if (env.node_env == 'development') {
  process.env.host = "localhost:8000"
  process.env.secretKey = 'milkyway is the only way'
  process.env.db = 'pitchforks'
  process.env.dbUser = "proto"
  process.env.dbPwd = "admin"
}

if (env.node_env == 'production') {
  process.env.host = "http://pitchforks.herokuapp.com"
}
process.env.host = "http://localhost:8000"
process.env.secret = "YKoEJqo2HIy5GPxcPlL9"
process.env.pwdSecret = "LNo9D2LeubIkre11VRmd"
process.env.dbUser = "proto"
process.env.dbPwd = "admin"

process.env.twitterOauthRequest = "https://api.twitter.com/oauth/request_token"
process.env.twitterOauthAccess = "https://api.twitter.com/oauth/access_token"
process.env.twitterOauthCallback = "/auth/twitter/callback"
process.env.twitterAuth = "https://api.twitter.com/oauth/authenticate?oauth_token="
process.env.twitterSecret = "Z4wNbKa0U9TVJ00JYounKoallyt49OUChkJrTV150Lws9CFjlH"
process.env.twitterKey = "nuM3RNg418RQ3C3xtemobYMQd"
