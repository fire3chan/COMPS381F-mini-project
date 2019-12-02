const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;


const run = (req, res) => {
	const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
	const dbName = "test";
	const client = new MongoClient(dbLink);
	let abc = new ObjectID(req.query._id);


	const deleteRestaurant = (db, callback) => {
		console.log(abc);
		db.collection("prorestaurant").removeOne({ "_id": abc }, (err, result) => {
			assert.equal(err, null);
			console.log("delete was successful!");
			console.log(JSON.stringify(result));
			callback();
		});
	}

	client.connect((err) => {
		try {
			assert.equal(err, null);
		} catch (err) {
			res.render("message.ejs", {
				message: "MongoClient connect() failed!",
				buttonLink: "/read",
				buttonText: "Home"
			});
			res.end();

			return;
		}

		const db = client.db(dbName);
		deleteRestaurant(db, () => {

			client.close();
			res.render("message.ejs", {
				message: "Restaurant was deleted!",
				buttonLink: "/read",
				buttonText: "Home"
			});
			res.end();


		});

	})

}



module.exports = run;
