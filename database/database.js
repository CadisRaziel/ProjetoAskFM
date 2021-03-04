//conexão com o database usando sequelize(bem simples né)

const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'rhythms', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection