const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
/*
Test data:
curl -H "Content-Type: application/json" -X POST -d '{"name":"restaurant DEF","borough":"Tokyo","cuisine":"Japan","address":{"street":"dsa","building":"happy building","zipcode":"723","latitude":32,"longitude":6}}' localhost:8099/api/restaurant
*/

const run = (req, res) => {

	console.log("Incoming request: " + req.method);
	console.log("Path: " + req.path);
	console.log("Request body: ", req.body);

	let newRestaurant = {};

	newRestaurant["name"] = req.body.name; //POST request msg body
	newRestaurant["borough"] = req.body.borough;
	newRestaurant["cuisine"] = req.body.cuisine;
	newRestaurant.address = {};
	newRestaurant.address["street"] = req.body.address.street;
	newRestaurant.address["building"] = req.body.address.building;
	newRestaurant.address["zipcode"] = req.body.address.zipcode;
	newRestaurant.address["coord"] = req.body.address.latitude + ", " + req.body.address.longitude;

	const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

	const dbName = "test";
	const client = new MongoClient(dbLink);
	let resultObj = {};

	client.connect((err) => {
		assert.equal(null, err);
		console.log("successful to connect to db!");

		const db = client.db(dbName);

		insertRestaurant(db, newRestaurant, () => {
			client.close();
			if (resultObj.ops[0]._id) {
				//return status ok
				res.json({
					"status": "ok",
					"_id": resultObj.ops[0]._id
				}).end();
			} else {
				//else return status failed
				res.json({
					"status": "failed"
				}).end();
			}
		});
	});

	const insertRestaurant = (db, newRestaurant, callback) => {
		db.collection("prorestaurant").insertOne(newRestaurant, (err, result) => {
			assert.equal(err, null);
			console.log("insert was successful!");
			console.log(JSON.stringify(result));
			resultObj = result;
			callback();
		});
	}

}

module.exports = run;
