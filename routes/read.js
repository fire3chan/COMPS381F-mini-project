const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;

const run = (req, res) => {

	const dbLink = 'mongodb://student:std9870@cluster0-shard-00-00-pdydm.mongodb.net:27017,cluster0-shard-00-01-pdydm.mongodb.net:27017,cluster0-shard-00-02-pdydm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
    //const dbLink = "mongodb+srv://firework:dark0411@cluster0-sbkrx.azure.mongodb.net/test?retryWrites=true&w=majority";
    const dbName = "test";
    const client = new MongoClient(dbLink);

    client.connect((err) => {
        assert.equal(null, err);
        console.log("successful to connect to db!");

        const db = client.db(dbName);
		
		findRestaurants(db, max, criteria, (restaurants) => {
			client.close();
			
			res.render('display.ejs',{			
				sessionName = ;
				count =;
				critera =;
				items= ;
				'<div class="list-group-item">'+					
                '<p class="mb-1">'+'<a href=/display?_id='+doc._id+'">'+doc.name+'</a>'+'</p>'                      
                +'</div>';				
			})	
		})
    })
  }/*else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write('<html><body>');
		res.write(`${doc} : Invalid document!\n`);
		res.end('<br><a href=/read>Home</a>');	
	}*/

	const findRestaurants = (db, max, criteria, callback) => {
		//console.log(`findRestaurants(), criteria = ${JSON.stringify(criteria)}`);
		let criteriaObj = {};
		try {
			criteriaObj = JSON.parse(criteria);
		} catch (err) {
			console.log('Invalid criteria!  Default to {}');
		}
		cursor = db.collection('prorestaurant').find(criteriaObj).sort({name: -1}); 
		cursor.toArray((err,docs) => {
			assert.equal(err,null);
			//console.log(docs);
			callback(docs);
		});
	}
		
	
module.exports = run;
