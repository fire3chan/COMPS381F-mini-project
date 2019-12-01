const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const url = require('url');

// curl -X GET localhost:8099/api/restaurant/:name
const run = (req, res) => {
		
	//get parameter variable :name
	let byName = req.params.name;
	let criteria = {name: byName};
		
	//if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
		const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

		const dbName = "test";
		const client = new MongoClient(dbLink);

		client.connect((err) => {
			assert.equal(null, err);
			console.log("successful to connect to db!");

			const db = client.db(dbName);

			findRestaurants(db, criteria, (restaurants) => {
				client.close();
				
				//if a document found, return a JSON object 
				if(Object.keys(restaurants).length > 0){
					res.status(200).type('json').json(restaurants).end();
				}else{
					//else output {}
					res.status(200).type('json').json({}).end();
				}
			});			
		});
		
	/*} else {
		res.redirect("/");
		res.end();
	}*/
	
	const findRestaurants = (db, criteria, callback) => {
		cursor = db.collection('prorestaurant').find(criteria).sort({ name: -1 });
		let restaurants = [];
		cursor.forEach((doc) => {
			restaurants.push(doc);
		}, (err) => {
			// done or error
			assert.equal(err, null);
			callback(restaurants);
		})
	}
	
};

module.exports = run;
