const express = require('express');
const bodyParser = require('body-parser');
const indexPage = require('./routes/index');
const verifyPage = require('./routes/verify');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static file setting
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap_css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// path handling
app.get("/", indexPage);
app.post("/verify",   verifyPage);

app.listen(process.env.PORT || 8099);