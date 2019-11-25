const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const express = require('express');
const app = express();
const fs = require('fs'); //require file system
const formidable = require('formidable');

//app.use(fileUpload());

const run = (req, res) => {

	const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
    //const dbLink = "mongodb+srv://firework:dark0411@cluster0-sbkrx.azure.mongodb.net/test?retryWrites=true&w=majority";
    const dbName = "test";
    const client = new MongoClient(dbLink);
   
   let form = new formidable.IncomingForm();
   
	form.parse(req, (err, fields, files) =>{
		console.log(JSON.stringify(files));
	
		/*if (files.photo.size == 0) {
		  //res.status(500).end("No file uploaded!");  
		}*/
		
		//get filepath
		let filename = files.photo.path;
		
		//get file upload type
		if (files.photo.type) {
		  var mimetype = files.photo.type;
		  console.log(`mimetype = ${mimetype}`);
		}
		
		//check upload file is image
		if (!mimetype.match(/^image/)) {
		  res.status(500).end("Upload file not image!");
		  return;
		}	
	
		//file system read file
		fs.readFile(filename, (err,data) => {
		  let client = new MongoClient(mongourl);
			client.connect((err) => {
			try {
			  assert.equal(err,null);
			} catch (err) {
			  //res.status(500).end("MongoClient connect() failed!");
			}
			const db = client.db(dbName);
			let restaurant = {};
			restaurant['name'] = fields.title;
			restaurant['borough'] = fields.borough;
			restaurant['cuisine'] = fields.cuisine;
			restaurant['street'] = fields.street;
			restaurant['building'] = fields.building;
			restaurant['zipcode'] = fields.zipcode;
			restaurant['lon'] = fields.lon;
			restaurant['lat'] = fields.lat;
			restaurant['mimetype'] = mimetype;
			restaurant['image'] = new Buffer.from(data).toString('base64');
			
			insertRestaurant(db, restaurant,(result) => {
			  
				client.close();
			  
			  	res.render('displayItem.ejs',{
				restName: restaurant['name'],
				mimetype: restaurant['mimetype'],			
				photo:  restaurant['image'],  
							  
				boro: restaurant['borough'],
				cuis: restaurant['cuisine'],
				street: restaurant['street'],
				build: restaurant['lon'],
				zipcode: restaurant['zipcode'],
				gps: [restaurant['lon'], restaurant['lat']],
				rate: "",
				owner: "",
							  
				//rateWithId: "/rate?_id="+docObj._id,
				//editWithId: "/change?_id="+docObj._id,
				 //delWithId: "/remove?_id="+docObj._id
				 
				rateWithId: "",
				editWithId: "",
				delWithId: ""
				})
				
				//res.status(200).end('Restaurant was inserted into MongoDB!');  
			});
			
		  });
		});
	});   
	
	function insertRestaurant(db,r,callback) {
	  db.collection('prorestaurant').insertOne(r,function(err,result) {
		assert.equal(err,null);
		console.log("insert was successful!");
		console.log(JSON.stringify(result));
		callback(result);
	  });
	}
}


module.exports = run;
