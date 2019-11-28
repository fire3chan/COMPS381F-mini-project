const run = (req, res) => {
    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
        res.render("update.ejs", { sessionName: req.cookies.session, _id: req.query._id });
    } else {
        res.redirect("/");
    }

};

module.exports = run;