var sql = require("mssql");
var FCM = require('fcm-node');
var serverKey = require('E:/nodepackage/key.json'); //put the generated private key path here     



const config = {
    user: 'sa',
    password: 'sid',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'safev1',
    port: 50074
}

function profile(obj) {
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query_test=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[profile] set name='`+obj.name+`',number='`+obj.number+`',age='`+obj.age+`',email='`+obj.email+`',
        				pwd='`+obj.pwd+`',msg='`+obj.msg+`',blood='`+obj.blood+`',sex='`+obj.sex+`' where uid='`+obj.uid+`';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values 
						('`+obj.uid+`','`+obj.name+`','`+obj.number+`','`+obj.age+`','`+obj.email+`','`
						+obj.pwd+`','`+obj.msg+`','`+obj.blood+`','`+obj.sex+`')
						END COMMIT TRANSACTION;`
        var query1="insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values ('"+obj.uid+"','"+obj.name+"','"+obj.number+"','"+obj.age+"','"+obj.email+"','"+obj.pwd+"','"+obj.msg+"','"+obj.blood+"','"+obj.sex+"');";
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
    var fcm = new FCM(serverKey);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        /*var query_alert=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[alert] set lat='`+obj.lat+`',long='`+obj.long+`' where uid='`+obj.uid+`';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[alert] (uid,lat,long) values 
						('`+obj.uid+`','`+obj.lat+`','`+obj.long+`')
						END COMMIT TRANSACTION;`*/
        
        
        /*var query_call_people=`SELECT * FROM(SELECT  uid, (3959 * acos (cos ( radians(`+obj.lat+`) )
      * cos( radians( lat ) )* cos( radians( long ) - radians(`+obj.long+`) )
      + sin ( radians(`+obj.lat+`) )* sin( radians( lat )))) AS distance FROM [safet].[dbo].[all_users]) newtable where newtable.distance!=0`


        req.query(query_call_people, function (err, data) {
                if (err) {
                    console.log("2. err = " + err);
                    return;
                } else {
                    console.log(data);
                }
                conn.close();
            });
*/


        var query_get_tokens=`SELECT token FROM(SELECT  au.uid, (3959 * acos (cos ( radians(`+obj.lat+`) )
      * cos( radians( au.lat ) )* cos( radians( au.long ) - radians(`+obj.long+`) )
      + sin ( radians(`+obj.lat+`) )* sin( radians( au.lat )))) AS distance,ft.token FROM [safet].[dbo].[all_users] au,
      [safet].[dbo].[fcm_token] ft where au.uid=ft.uid) newtable where newtable.distance!=0`


        req.query(query_get_tokens, function (err, data) {
                if (err) {
                    console.log("2. err = " + err);
                    return;
                }
                else 
                {
                	for (var i = 0; i < data.length; i++) {
    					var row = data[i];
    					console.log(row.token);
    					var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        								to:row.token,// 'fnsELZ3z7QQ:APA91bFnCxnhxnmQJkLH2-3u8mYl1uPH0ibDy01NYSpD07pNuBiVZbrIa-lKmQbeJC3p2XbGQlTicd0DZERe1oaQ5dkkCbnMx7_XIyRSyormuGHCY59hHMv2tnd4V35CjbfwtjtSOqQU', 
        								notification: {
							            title: 'message', 
							            body: obj.lat+','+obj.long},      
   	 								};
    
					    fcm.send(message, function(err, response){
					        if (err) {
					            console.log("Something has gone wrong!")
					        } else {
					            console.log("Successfully sent with response: ", response)
					        }
					    });
										}
					                //    console.log(json(data));
                }
                conn.close();
            });



    });
/*
    var fcm = new FCM(serverKey);
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to: 'fnsELZ3z7QQ:APA91bFnCxnhxnmQJkLH2-3u8mYl1uPH0ibDy01NYSpD07pNuBiVZbrIa-lKmQbeJC3p2XbGQlTicd0DZERe1oaQ5dkkCbnMx7_XIyRSyormuGHCY59hHMv2tnd4V35CjbfwtjtSOqQU', 
        notification: {
            title: 'message', 
            body: obj.lat+','+obj.long 
        },
        
        
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    });*/
}


function fcm_token(obj) {
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query_alert=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
                        update [safet].[dbo].[fcm_token] set token='`+obj.fcm_token+`' where uid='`+obj.uid+`';
                        IF @@ROWCOUNT = 0
                        BEGIN
                        insert into [safet].[dbo].[fcm_token] (uid,token) values 
                        ('`+obj.uid+`','`+obj.fcm_token+`')
                        END COMMIT TRANSACTION;`
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
function registration(obj){
    var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query1="insert into [safet].[dbo].[registration] (name,number,email,pwd) values ('"+obj.name+"','"+obj.number+"','"+obj.email+"','"+obj.pwd+"');";
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







function main_table(obj) {
   	var conn = new sql.Connection(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log("1. err = " + err);
            return;
        }
        var query_alert=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[all_users] set lat=
        				CAST('`+obj.lat+`' AS DECIMAL(12,9)),long=CAST('`+obj.long+`' AS DECIMAL(12,9)) where uid='`+obj.uid+`';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[all_users] (uid,lat,long) values 
						('`+obj.uid+`',CAST('`+obj.lat+`' AS DECIMAL(12,9)),CAST('`+obj.long+`' AS DECIMAL(12,9)))
						END COMMIT TRANSACTION;`
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





const http = require('http')  
const port = 4000

const requestHandler = (request, response) => { 
     

    console.log(request.url);
    request.on('data', function (data) {
            var request = require('request');//added for push notification
           
            console.log("Partial body: " + data);
            var obj = JSON.parse(data);
            
            if (obj.table=="profile") {
            	profile(obj);  
            }
            else if (obj.table=="alert") {
                alert(obj);
            }
            else if (obj.table=="location") {
                main_table(obj);
            }
            else if(obj.table=="fcm_token"){
                fcm_token(obj);
            } else {
                console.log("");//request not matching any table number
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
