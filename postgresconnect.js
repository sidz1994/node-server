var pg=require('pg');


var connectionString="postgres://postgres:sid@localhost:5432/postgis_23_sample"


var client= new pg.Client(connectionString);
client.connect(function(err) {

if (err) {
    return console.log('something bad happened', err)
  }

  client.query("SELECT * FROM public.all_users;",function(err,result){
  	client.end();
  	if (err) {
    	console.log("2. err = " + err);
        return;
        }
  	//console.log(JSON.stringify(result));
  	console.log(result.rows);
    });
  
});


