if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize')
      , sequelize = null
  
    if (process.env.DATABASE_URL) {
      // the application is executed on Heroku ... use the postgres database
      var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
      sequelize = new Sequelize(match[5], match[1], match[2], {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     match[4],
        host:     match[3],
        logging:  false
      })
    } else {
      // the application is executed on the local machine ... use mysql
      sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: 'database.sqlite',
        });
    }
  
    global.db = {
      Sequelize: Sequelize,
      sequelize: sequelize,
      Balances:      sequelize.import('../models/Balances'),
      Assets:        sequelize.import('../models/Assets'),
      OwnedAssets:   sequelize.import('../models/OwnedAssets'),
      BuyOrder:      sequelize.import('../models/BuyOrder'),
      Factions:      sequelize.import('../models/Factions')
    }
  
    /*
      Associations can be defined here. E.g. like this:
      global.db.User.hasMany(global.db.SomethingElse)
    */
  }
  
  module.exports = global.db