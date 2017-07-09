//'use strict';

var sql = require("mssql");


const config = {
    user: 'sa',
    password: 'sid',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'safev1',
    port: 50074
}



function getlats() {

    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        req.query("SELECT *  FROM [safev1].[dbo].[lats];", function (err, data) {
                if (err) {
                    console.log("2. err = " + err);
                    return;
                } else {
                    console.log(data);
                }
                conn.close();
            });
    });
}
getlats();