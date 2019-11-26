const run = (req, res) => {
    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
        console.log(req.cookies.session);
        res.redirect("/read");
        res.end();
    } else {
        res.render("login.ejs");
        res.end();
    }
};

module.exports = run;