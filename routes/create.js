const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const fs = require('fs'); //require file system
const formidable = require('formidable');

const run = (req, res) => {

	const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

	const dbName = "test";
	const client = new MongoClient(dbLink);

	let form = new formidable.IncomingForm();

	let restaurant = {};

	const insertRestaurant = (db, restaurant, callback) => {
		db.collection('prorestaurant').insertOne(restaurant, (err, result) => {
			assert.equal(err, null);
			console.log("insert was successful!");
			console.log(JSON.stringify(result));
			callback();
		});
	}

	const getRestaurantId = (db, callback) => {
		db.collection('prorestaurant').count((error, result) => {
			assert.equal(error, null);
			callback(result);
		})
	}

	form.parse(req, (err, fields, files) => {
		assert.equal(err, null);

		console.log('Fields', fields);
		let photo = files.photo;
		console.log(photo);
		let filename = photo.path;

		if (photo.size === 0) {
			console.log("No file");
			res.writeHead("500", { "Content-Type": "plain/html" });
			res.send("No file uploaded!");
			res.end();
			return;
		}

		if (photo.type) {
			//check upload file is image
			if (!photo.type.match(/^image/)) {
				res.writeHead("500", { "Content-Type": "plain/html" });
				res.send("Upload file not image!");
				res.end();
				return;
			}
			restaurant["photo_mimetype"] = photo.type;
		}

		fs.readFile(filename, (err, data) => {
			assert.equal(err, null);
			restaurant['photo'] = new Buffer.from(data).toString('base64');

			client.connect((err) => {
				try {
					assert.equal(err, null);
				} catch (err) {
					res.writeHead(500, { "Content-Type": "plain/html" });
					res.send("MongoClient connect() failed!");
					res.end();
					return;
				}

				const db = client.db(dbName);
				getRestaurantId(db, (result) => {
					restaurant['restaurant_id'] = result;
					restaurant['name'] = fields.name;
					restaurant['borough'] = fields.borough;
					restaurant['cuisine'] = fields.cuisine;
					restaurant.address = {};
					restaurant.address['street'] = fields.street;
					restaurant.address['building'] = fields.building;
					restaurant.address['zipcode'] = fields.zipcode;
					restaurant.address['coord'] = fields.latitude + ", " + fields.longitude;
					restaurant['owner'] = req.cookies.session;

					insertRestaurant(db, restaurant, () => {
						res.send("Restaurant was inserted into MongoDB!");
						client.close();
						res.end();

					});
				});
			})
		});

	});

}


module.exports = run;
