const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const run = (req, res) => {

	const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

	const dbName = "test";
	const client = new MongoClient(dbLink);

	let criteria = {};
	criteria["_id"] = ObjectID(req.query._id);

	client.connect((err) => {
		assert.equal(null, err);
		console.log("successful to connect to db!");

		const db = client.db(dbName);

		findRestaurants(db, criteria, (restaurants) => {
			client.close();

			//returns string of number, number
			let coord = restaurants[0].address.coord;
			let str = [];
			if (coord && coord != undefined && coord != null) {
				str = coord.split(", ");
			}

			//restaurants = search result
			res.render("displayItem.ejs", {
				sessionName: req.cookies.session,
				owner: restaurants[0].owner,
				mimetype: restaurants[0].photo_mimetype,
				photo: restaurants[0].photo,
				//define the restaurants array = restaurants return search result
				restaurants: restaurants,

				showMap: "/gmap?lat=" + str[0] + "&lon=" + str[1] + "&name=" + restaurants[0].name,
				rateWithId: "/rateForm?_id=" + restaurants[0]._id,
				editWithId: "/gotoUpdate?_id=" + restaurants[0]._id,
				delWithId: "/delete?_id=" + restaurants[0]._id
			})
		})

	})

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
