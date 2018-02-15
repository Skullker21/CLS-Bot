const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Balances = sequelize.import('models/Balances');
const Assets = sequelize.import('models/Assets');

module.exports = {Balances, Assets};