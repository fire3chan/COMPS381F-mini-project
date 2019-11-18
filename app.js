const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const loginPage = require('./routes/login');
const verifyPage = require('./routes/verify');
const displayPage = require('./routes/display');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

// static file setting
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap_css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// path handling
app.get("/", loginPage);
app.post("/verify",   verifyPage);
app.get("/display",   displayPage);

app.listen(process.env.PORT || 8099);