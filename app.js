const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const loginPage = require('./routes/login');
const verifyPage = require('./routes/verify');
const formPage = require('./routes/new');
const createPage = require('./routes/create');
const displayPage = require('./routes/displayItem');
const readPage = require('./routes/read');
const showMap = require('./routes/showMap');
const updatePage = require('./routes/update');
const gotoUpdatePage = require('./routes/gotoUpdate');
const messagePage = require('./routes/message');
const rateFormPage = require('./routes/rateForm');
const ratePage = require('./routes/rate');

const restfulGetName = require('./routes/restfulGetName');
const restfulGetBoro = require('./routes/restfulGetBoro');
const restfulGetCuis = require('./routes/restfulGetCuis');
const restfulPost = require('./routes/restfulPost');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// static file setting
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap_css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// path handling
app.get("/", loginPage);
app.post("/verify", verifyPage);
app.get("/new", formPage);
app.post("/create", createPage);
app.get("/display", displayPage);
app.get("/read", readPage);
app.get("/gmap", showMap);
app.post("/update", updatePage);
app.get("/gotoUpdate", gotoUpdatePage);
app.post("/message", messagePage);
app.get("/rateForm", rateFormPage);
app.post("/rate", ratePage);

/* RESTful */
app.get('/api/restaurant/name/:name', restfulGetName);
app.get('/api/restaurant/borough/:borough', restfulGetBoro);
app.get('/api/restaurant/cuisine/:cuisine', restfulGetCuis);
app.post('/api/restaurant', restfulPost);



app.listen(process.env.PORT || 8099);