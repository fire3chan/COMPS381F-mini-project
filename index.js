const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/bootstrap_css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap_js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.get("/", (req, res) => {
    console.log(__dirname);
    res.render("login.ejs", {
    });
    res.end();
});

app.listen(process.env.PORT || 8099);