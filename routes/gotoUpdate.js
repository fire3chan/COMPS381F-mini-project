const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const dbName = "test";
const client = new MongoClient(dbLink);

const run = (req, res) => {

    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
      
      let restaurantIdObj = new ObjectID(req.query._id);
      const findRestaurant = (db, callback) => {
        db.collection("prorestaurant").findOne({ "_id": restaurantIdObj }, (err, result) => {
            assert.equal(null, err);
            const restaurantObj = result;
            callback(restaurantObj);
        });
    };

    client.connect((err) => {
        assert.equal(null, err);
        console.log("successful to connect to db!");

        const db = client.db(dbName);

        findRestaurant(db, (restaurant) => {
            let coord = restaurant.address.coord;
            let str = [];
            str = coord.split(",");
            let lat = parseInt(str[0]);
            let lot = parseInt(str[1]);
            res.render("update.ejs", {
                sessionName: req.cookies.session,
                _id: req.query._id,
                restaurant: restaurant,
                lat: lat,
                lot: lot
            });
            res.end();
            client.close();
        });

    });
    } else {
        res.redirect("/");
        res.end();
    }
}

module.exports = run;
