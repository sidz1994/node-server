var sql = require("mssql");


const config = {
    user: 'sa',
    password: 'sid',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'safev1',
    port: 50074
}

function profile(obj) {
    //var str =datavals;
    //var obj = JSON.parse(str);
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query_test = `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[profile] set name='`+ obj.name + `',number='` + obj.number + `',age='` + obj.age + `',email='` + obj.email + `',
        				pwd='`+ obj.pwd + `',msg='` + obj.msg + `',blood='` + obj.blood + `',sex='` + obj.sex + `' where uid='` + obj.uid + `';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values 
						('`+ obj.uid + `','` + obj.name + `','` + obj.number + `','` + obj.age + `','` + obj.email + `','`
            + obj.pwd + `','` + obj.msg + `','` + obj.blood + `','` + obj.sex + `')
						END COMMIT TRANSACTION;`
        var query1 = "insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values ('" + obj.uid + "','" + obj.name + "','" + obj.number + "','" + obj.age + "','" + obj.email + "','" + obj.pwd + "','" + obj.msg + "','" + obj.blood + "','" + obj.sex + "');";
        //console.log(query1)
        req.query(query_test, function (err, data) {
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


function alert(obj) {
   	var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query_alert = `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[alert] set lat='`+ obj.lat + `',long='` + obj.long + `' where uid='` + obj.uid + `';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[alert] (uid,lat,long) values 
						('`+ obj.uid + `','` + obj.lat + `','` + obj.long + `')
						END COMMIT TRANSACTION;`
        //var query1="insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values ('"+obj.uid+"','"+obj.name+"','"+obj.number+"','"+obj.age+"','"+obj.email+"','"+obj.pwd+"','"+obj.msg+"','"+obj.blood+"','"+obj.sex+"');";
        //console.log(query1)
        req.query(query_alert, function (err, data) {
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





//table 1
function registration(obj) {
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query1 = "insert into [safet].[dbo].[registration] (name,number,email,pwd) values ('" + obj.name + "','" + obj.number + "','" + obj.email + "','" + obj.pwd + "');";
        req.query(query1, function (err, data) {
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







function sendMessageToUser(deviceId, message) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AAAAAlXppOM:APA91bEVEkKZ1sSzu7cx3jmxJGmTdnKsOrHevlOKMXH_KkYk6g-Gvfxs2sMmRu-HI2nKNo6R6TULST-Ml5zcmh93NwT5RMyjYFv-51ZfBAbCRL0yG8ZkfMf-UW0JIHd5_cimRfnXf8fE'
        },
        body: JSON.stringify(
            {
                "data": {
                    "message": message
                },
                "to": deviceId
            }
        )
    }, function (error, response, body) {
        if (error) {
            console.error(error, response, body);
        }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
        }
        else {
            console.log('Done!')
        }
    });

}




    const http = require('http')
    const port = 4000

    const requestHandler = (request, response) => {


        console.log(request.url);
        request.on('data', function (data) {
            var request = require('request');//added for push notification

            console.log("Partial body: " + data);
            var obj = JSON.parse(data);

            if (obj.table == "profile") {
                profile(obj);
            }
            if (obj.table == "alert") {
                alert(obj);
            }

        });
        console.log("I'm available");

    }

    const server = http.createServer(requestHandler)

    server.listen(port, (err) => {

        if (err) {
            return console.log('something bad happened', err)
        }

        console.log(`server is listening on ${port}`)

    })
}