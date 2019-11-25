const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;

const run = (req, res) => {

  const dbLink = "mongodb+srv://firework:dark0411@cluster0-sbkrx.azure.mongodb.net/test?retryWrites=true&w=majority";
  const dbName = "test";

  const client = new MongoClient(dbLink);

  let dbPassword = "";
  const userid = req.body.userid;
  const password = req.body.password;

  const callback = () => {
    if (password == dbPassword) {
      console.log("correct");
      res.cookie("session", userid);
      res.redirect("/read");
      res.end();

    } else {
      console.log("incorrect");
      res.setHeader("200", { "Content-Type": "plain/html" });
      res.send("Your password is not correct!");
    }
    res.end();
  };

  client.connect((err) => {
    assert.equal(null, err);
    console.log("successful to connect to db!");

    const db = client.db(dbName);

    let cursor = db.collection('user').find({ "userid": userid }).limit(1);
    cursor.count((error, count) => {
      if (count == 0) {
        res.setHeader("200", { "Content-Type": "plain/html" });
        res.send("Your userid does not exist!");
        res.end();
      } else {
        cursor.forEach((doc) => {
          dbPassword = doc.password;
        }, () => {
          callback();
        });
      }
    });

  })
  client.close();

};


module.exports = run;
