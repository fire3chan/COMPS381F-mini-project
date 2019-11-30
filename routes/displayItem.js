const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

const run = (req, res) => {

	const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

    const dbName = "test";
    const client = new MongoClient(dbLink);

	let criteria = {};
    criteria['_id'] = ObjectID(req.query._id);
	
		client.connect((err) => {
			assert.equal(null, err);
			console.log("successful to connect to db!");

			const db = client.db(dbName);
							
			findRestaurants(db, criteria, (restaurants) => {
				client.close();
				
				//restaurants = search result
				res.render('displayItem.ejs',{			
					owner : req.cookies.session,
					mimetype : "",
					photo : "",
					//define the restaurants array = restaurants return search result
					restaurants : restaurants,
					//showMap : "/gmap?lat="+restaurants[0].lat+"&lon="+restaurants[0].lon+"&name="+restaurants[0].name,
					showMap : "/gmap?lat="+restaurants[0].lat+"&lon="+restaurants[0].lon,
					rateWithId	:"/rateForm?_id="+restaurants[0]._id,
					editWithId  :"/edit?_id="+restaurants[0]._id,
					delWithId	:"/delete?_id="+restaurants[0]._id		
				})	
			})
			
		})
		
}

	const findRestaurants = (db, criteria, callback) => {
		cursor = db.collection('prorestaurant').find(criteria).sort({name: -1}); 	
		let restaurants = [];		
		cursor.forEach((doc) => {
			restaurants.push(doc);
		}, (err) => {
			// done or error
			assert.equal(err,null);
			callback(restaurants);
		})
	}
		
	
module.exports = run;
