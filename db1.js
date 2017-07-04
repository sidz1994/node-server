var sql = require("mssql");


const config = {
    user: 'sa',
    password: 'sid',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'safev1',
    port: 50074
}



function postlats(datavals) {
    var str =datavals;
    var obj = JSON.parse(str);
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        req.query("insert into [safev1].[dbo].[lats] (lat,long) values ("+obj.lat+","+obj.long+");", function (err, recordset) {
                if (err) {
                    console.log("2. err = " + err);
                    return;
                } else {
                    console.log(recordset);
                }
                conn.close();
            });
    });
}









const http = require('http')  
const port = 4000

const requestHandler = (request, response) => { 
     

    console.log(request.url);
    request.on('data', function (data) {
           
            console.log("Partial body: " + data);
            postlats(data);
            var str =data;
            var obj = JSON.parse(str);
            console.log(obj.user_id);
            console.log();

            
        });
console.log("I'm active");
  
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
    
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
    
})
