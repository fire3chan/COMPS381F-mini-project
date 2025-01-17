const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const url = require("url");

const run = (req, res) => {
	if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
		const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

		const dbName = "test";
		const client = new MongoClient(dbLink);

		let parsedURL = url.parse(req.url, true); // true to get query as object 
		let criteria = parsedURL.query;  //get searching criteria

		client.connect((err) => {
			assert.equal(null, err);
			console.log("successful to connect to db!");

			const db = client.db(dbName);

			findRestaurants(db, criteria, (restaurants) => {
				client.close();

				//restaurants = search result
				res.render("display.ejs", {
					sessionName: req.cookies.session,
					length: restaurants.length,
					criteria: JSON.stringify(criteria),
					//define the restaurants array = restaurants return search result
					restaurants: restaurants
				});
				res.end();
			});

		});

	} else {
		res.redirect("/");
		res.end();
	}

}

const findRestaurants = (db, criteria, callback) => {
	cursor = db.collection("prorestaurant").find(criteria).sort({ name: -1 });
	let restaurants = [];
	cursor.forEach((doc) => {
		restaurants.push(doc);
	}, (err) => {
		// done or error
		assert.equal(err, null);
		callback(restaurants);
	})
}


module.exports = run;
