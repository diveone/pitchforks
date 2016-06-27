var env = {
  development: {
    host: process.env.HOST,
    port: process.env.PORT,
    dbPort: process.env.DB_PORT,
    secretKey: process.env.SECRET_KEY,
    dbName: "pitchforks_dev",
    dbUser: process.env.DB_USER,
    dbPwd: process.env.DB_PASSWORD,
    twitterSecret: process.env.TWITTER_SECRET,
    twitterKey: process.env.TWITTER_KEY,
    twitterRequest: process.env.TWITTER_REQUEST,
    twitterAccess: process.env.TWITTER_ACCESS
  },
  production: {
    host: process.env.HOST,
    port: process.env.PORT,
    dbPort: process.env.DB_PORT,
    secretKey: process.env.SECRET_KEY,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPwd: process.env.DB_PASSWORD,
    twitterSecret: process.env.TWITTER_SECRET,
    twitterKey: process.env.TWITTER_KEY,
    twitterRequest: process.env.TWITTER_REQUEST,
    twitterAccess: process.env.TWITTER_ACCESS
  },
  testing: {
    host: process.env.HOST,
    port: process.env.TEST_PORT,
    dbPort: process.env.DB_PORT,
    secretKey: process.env.SECRET_KEY,
    dbName: "pitchforks_test",
    dbUser: process.env.DB_USER,
    dbPwd: process.env.DB_PASSWORD
  }
}

module.exports = env;
