const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs"); //require file system
const formidable = require("formidable");
const ObjectID = require("mongodb").ObjectID;


const run = (req, res) => {

	const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

	const dbName = "test";
	const client = new MongoClient(dbLink);

	let form = new formidable.IncomingForm();
	let restaurant = {};


	form.parse(req, (err, fields, files) => {
		assert.equal(err, null);

		console.log("Fields", fields);
		let photo = files.photo;
		console.log(photo);

		let filename = photo.path;
		let restaurantIdObj = new ObjectID(fields._id);


		const updateRestaurant = (db, restaurant, callback) => {
			db.collection("prorestaurant").updateOne({ "_id": restaurantIdObj }, { $set: restaurant }, (err, result) => {
				assert.equal(err, null);
				console.log("update was successful!");
				console.log(JSON.stringify(result));
				callback();
			});
		}



		if (photo.size === 0) {
			console.log("No file");
			res.render("message.ejs", {
				message: "No file uploaded!",
				buttonLink: "Back",
				buttonText: "Back"
			});
			res.end();
			return;
		}

		if (photo.type) {

			if (!photo.type.match(/^image/)) {
				res.render("message.ejs", {
					message: "Upload file not image!",
					buttonLink: "Back",
					buttonText: "Back"
				});
				res.end();
				return;
			}
			restaurant["photo_mimetype"] = photo.type;
		}

		fs.readFile(filename, (err, data) => {
			assert.equal(err, null);
			restaurant["photo"] = new Buffer.from(data).toString("base64");

			client.connect((err) => {
				try {
					assert.equal(err, null);
				} catch (err) {
					res.render("message.ejs", {
						message: "MongoClient connect() failed!",
						buttonLink: "Back",
						buttonText: "Back"
					});
					res.end();
					return;
				}

				restaurant["name"] = fields.name;
				restaurant["borough"] = fields.borough;
				restaurant["cuisine"] = fields.cuisine;
				restaurant.address = {};
				restaurant.address["street"] = fields.street;
				restaurant.address["building"] = fields.building;
				restaurant.address["zipcode"] = fields.zipcode;
				restaurant.address["coord"] = fields.latitude + ", " + fields.longitude;
				restaurant["owner"] = req.cookies.session;


				const db = client.db(dbName);
				updateRestaurant(db, restaurant, () => {
					res.render("message.ejs", {
						message: "Restaurant was updated!",
						buttonLink: "/read",
						buttonText: "Home"
					});
					res.end();
					client.close();

				});

			})
		});

	});

}



module.exports = run;
