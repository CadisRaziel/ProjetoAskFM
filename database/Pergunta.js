const Sequelize = require('sequelize')
const connection = require('./database')

const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING, //STRING = para textos curtos
        allowNull: false //impede que o campo receba valor nulo
    },
    descricao: {
        type: Sequelize.TEXT, //TEXT = para textos longos
        allowNull: false //impede que o campo receba valor nulo
    }
})

Pergunta.sync({force: false}) //sincroniza o que esta acima com a database
    .then(() => {}) //o then é executado quando a tabela é criada(lembra que é uma promise)
//ou seja se na database nao exista uma tabela pergunta, ele vai criar 
//force:false = não vai força a criação da tabela caso ela ja exista (não vai recriar)


module.exports = Pergunta