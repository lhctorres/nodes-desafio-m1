const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
   autoescape: true,
   express: app,
 });

 app.set('view engine', 'njk');
 app.set('views', path.join(__dirname, 'views'));
 app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
   res.render('main');
});

app.post('/check', (req, res) => {
   const nascimento = req.body.nascimento;
   const idade = moment().diff(moment(nascimento,
   "YYYY-MM-DD"), 'years');

   if (idade >= 18){
      res.redirect(`/major?nome=${req.body.nome}&idade=${idade}`);
   }else{
      res.redirect(`/minor?nome=${req.body.nome}&idade=${idade}`);
   }
});

const usuarioValido = (req, res, next) => {
   if ((req.query.nome == undefined) ||
       (req.query.idade == undefined) ||
       (req.query.nome == "") ||
       (req.query.idade == "")
      ){
         res.render('main');
   } else {
      next();
   }
};

app.get('/major', usuarioValido, (req, res) => {
   res.render('major', {nome: req.query.nome, idade: req.query.idade});
});

app.get('/minor', usuarioValido, (req, res) => {
   res.render('minor', {nome: req.query.nome, idade: req.query.idade});
});

app.listen(3000);
