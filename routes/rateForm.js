const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

const run = (req, res) => {
    const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

    const dbName = "test";
    const client = new MongoClient(dbLink);

    let restaurantIdObj = new ObjectID(req.query._id);

    const findRating = (callback) => {
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

            const db = client.db(dbName);

            db.collection('prorestaurant').findOne({ "_id": restaurantIdObj }, (err, result) => {
                assert.equal(err, null);

                let gradesArr = result.grades;
                const found = gradesArr.find(element => element.user == req.cookies.session);

                if (found == undefined) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        });
    }

    if (req.cookies.session !== null && req.cookies.session !== "" && req.cookies.session !== undefined) {
        findRating((ratedBefore) => {
            if (ratedBefore) {
                res.render("message.ejs", {
                    message: "You had rated this restaurant before!",
                    buttonLink: "Back",
                    buttonText: "Back"
                });
                res.end();
            } else {
                res.render("rate.ejs", { sessionName: req.cookies.session, _id: req.query._id });
                res.end();
            }
        });

    } else {
        res.redirect("/");
        res.end();
    }

}


module.exports = run;
