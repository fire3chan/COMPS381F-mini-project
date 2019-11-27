const assert = require("assert");

const run = (req, res) => {

	res.render("leafMap.ejs", {
		lat:req.query.lat,
		lon:req.query.lon,
		zoom:req.query.zoom ? req.query.zoom : 15
	});
	res.end();
	
};


module.exports = run;
