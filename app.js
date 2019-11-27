const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const loginPage = require('./routes/login');
const verifyPage = require('./routes/verify');
const formPage = require('./routes/new');
const createPage = require('./routes/create');
const readPage = require('./routes/read');
const showMap = require('./routes/showMap');
const updatePage = require('./routes/update');
const gotoUpdatePage = require('./routes/gotoUpdate');


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
app.post("/verify", verifyPage);
app.get("/new", formPage);
app.post("/create", createPage);
app.get("/read", readPage);
app.get("/gmap", showMap);
app.post("/update", updatePage);
app.get("/gotoUpdate", gotoUpdatePage);



/* handle other pathname
app.get('/*',(req,res)=>{ 
	res.status(500).render('Invalid Pathname!');
});*/

app.listen(process.env.PORT || 8099);