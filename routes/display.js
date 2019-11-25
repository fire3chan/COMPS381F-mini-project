const run = (req, res) => {
    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
        res.render("display.ejs", {sessionName: req.cookies.session});
        res.end();
    } else {
        res.redirect("/");
        res.end();
    }
    
};

module.exports = run;