// const run = (req, res) => {
//     if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
//         res.render("update.ejs", { sessionName: req.cookies.session, _id: req.query._id});
//         console.log(req.query.id);
//     } else {
//         res.redirect("/");
//     }

// };

// module.exports = run;


const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const url = require('url');
const ObjectID = require('mongodb').ObjectID;

const run = (req, res) => {

    const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
    const dbName = "test";
    const client = new MongoClient(dbLink);

    let parsedURL = url.parse(req.url, true);
    let abc = new ObjectID(req.url._id);

    const findRestaurants = (db, callback) => {
       db.collection('prorestaurant').findOne({"_id":abc},(err,result)=>{
        console.log(result);
        callback(result);
        
    });
    }
		client.connect((err) => {
			assert.equal(null, err);
			console.log("successful to connect to db!");

			const db = client.db(dbName);

			findRestaurants(db, (restaurants) => {
                // console.log(res.headersSent);
				res.render('update.ejs', {
					sessionName: req.cookies.session,
                    _id: req.query._id,
					// length: restaurants.length,
					restaurants: restaurants
				});
                res.end();
                
                client.close();
			});

        });
    }



module.exports = run;
