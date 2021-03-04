const express = require('express')
const app = express()
const port = 5000
const bodyParse = require('body-parser')
const connection = require("./database/database")
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//database connection 
connection.authenticate()
    .then(() => {
        console.log('Conexão com a database online')
    })
    .catch(err => {
        console.log(err)
    })

//estou dizendo para o Express usar o EJS como view engine
app.set('view engine', 'ejs')

//utilizando arquivos estaticos "('public') é o nome da pasta" [é para que aceite css, js front end, imagens etc..]
app.use(express.static('public'))

//adicionando o body parse para ver os itens no console
app.use(bodyParse.urlencoded({ extended: true }))

//lendo dados de formularios enviados via json(mais usado para api)
app.use(bodyParse.json())


//findAll = SELECT * FROM perguntas
// raw:true vai apaneas trazes as perguntas e nada mais( se eu tirar o raw veja como aparece varias outras informações que o usuario não pode ver)
// order: [['id', 'DESC]] = vai mudar a ordem ou seja, o ultimo id sempre vai estar no topo(as perguntas mais recente sempre estarão em cima)
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order: [['id', 'DESC']]})  
        .then(perguntas => {
            //console.log(perguntas) apenas para textar se no console aparece elas
            res.render("index", {
                perguntas: perguntas
            })
        })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    const titulo = req.body.titulo
    const descricao = req.body.descricao
    Pergunta.create({ //CREATE = INSERT INTO perguntas .... perguntas
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/") //depois de enviado a pergunta ele vai ser redirecionado para a pagina inicial
    })
})



//quando ele clicar na pergunta ele vai ser direcionado para pagina aonde tem somente essa pergunta com descrição
app.get("/perguntar/:id", (req, res) => {
    const id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(perguntar => {
        if(perguntar != undefined) { //pergunta encontrada

            //apresentar as respostas em baixo das perguntas
            Resposta.findAll({
                where: {perguntaId: perguntar.id},
                order: [ ['id', 'DESC'] ]
            }).then(respostas => { 
                res.render("pergunta", {
                    perguntar: perguntar,
                    respostas: respostas
                })
            })

        }else { //não encontrada 
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo
    const perguntaId = req.body.perguntar
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => { //vai ser chamado quando finalizar a resposta e vai redireciona para pagina da pergunta
        res.redirect("/perguntar/"+ perguntaId)
    })
})



app.listen(port, function (erro) {
    if (erro) {
        console.log("Connection error!")
    } else {
        console.log(`The server is running on the port ${port}`)
    }
})

module.exports = { app }