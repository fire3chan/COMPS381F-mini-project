const run = (req, res) => {
    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
        res.render("createRestaurant.ejs", { sessionName: req.cookies.session });
    } else {
        res.redirect("/");
    }

};

module.exports = run;