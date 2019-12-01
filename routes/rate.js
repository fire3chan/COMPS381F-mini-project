const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const formidable = require("formidable");
const ObjectID = require("mongodb").ObjectID;

const run = (req, res) => {

    const dbLink = "mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

    const dbName = "test";
    const client = new MongoClient(dbLink);

    let form = new formidable.IncomingForm();

    let grades = {};

    const updateGrades = (db, _id, callback) => {
        let restaurantIdObj = new ObjectID(_id);
        db.collection("prorestaurant").findOne({ "_id": restaurantIdObj }, (err, result) => {
            assert.equal(err, null);

            let gradesArr = result.grades;
            gradesArr.push(grades);

            db.collection("prorestaurant").update({ "_id": restaurantIdObj }, { $set: { "grades": gradesArr } }, (err, result) => {
                assert.equal(err, null);
                console.log("insert was successful!");
                console.log(JSON.stringify(result));
                callback();
            });
        });
    };

    form.parse(req, (err, fields, files) => {
        assert.equal(err, null);

        console.log("Fields", fields);

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

            grades["user"] = req.cookies.session;
            grades["score"] = fields.score;

            updateGrades(db, fields._id, () => {
                res.render("message.ejs", {
                    message: "You rate the restaurant successfully!",
                    buttonLink: "/read",
                    buttonText: "Home"
                });
                res.end();
                client.close();

            });
        })
    });



}


module.exports = run;
