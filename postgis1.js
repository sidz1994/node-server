var pg=require('pg');
var FCM = require('fcm-node');
var serverKey = require('E:/nodepackage/key.json'); //put the generated private key path here     
//var connectionString="postgres://postgres:123456@localhost:5432/gisdb"
var connectionString="postgres://postgres:sid@localhost:5432/postgis_23_sample"




function profile(obj) {
  var client= new pg.Client(connectionString);
  client.connect(function(err) {
    if (err) {
      return console.log("err = " + err);
    }
    var query_profile=`INSERT INTO public.profile (uid,name,number,age,email,pwd,msg,blood,sex) values 
                    ('`+obj.uid+`','`+obj.name+`','`+obj.number+`','`+obj.age+`','`+obj.email+`','`
                    +obj.pwd+`','`+obj.msg+`','`+obj.blood+`','`+obj.sex+`')
                    ON CONFLICT (uid)
                    DO UPDATE SET name=EXCLUDED.name,number=EXCLUDED.number,age=EXCLUDED.age,
                    email=EXCLUDED.email,pwd=EXCLUDED.pwd,msg=EXCLUDED.msg,blood=EXCLUDED.blood,sex=EXCLUDED.sex;`

    client.query(query_profile, function (err, result) {
      client.end();
      if (err) {
          console.log("err = " + err);
          return;
      } else {
          console.log(result.rows);
      }
    });
  });    
}





function fcm_token(obj) {
  var client= new pg.Client(connectionString);
  client.connect(function(err) {
    if (err) {
      return console.log("err = " + err);
    }
    var query_alert=`BEGIN;SET TRANSACTION ISOLATION LEVEL SERIALIZABLE READ WRITE;
                    INSERT INTO public.fcm_token (uid,token) values ('`+obj.uid+`','`+obj.fcm_token+`')
                    ON CONFLICT (uid)
                    DO UPDATE SET token=EXCLUDED.token;
                    COMMIT;`

    client.query(query_alert, function (err, result) {
      client.end();
      if (err) {
          console.log("err = " + err);
          return;
      } 
    });
  });    
}



function alert(obj)
{
  var client= new pg.Client(connectionString);
  client.connect(function(err) 
  {
    if (err) {
      return console.log("err = " + err);
    }

    var name='';
    var msg='';
    console.log(`'`+obj.uid+`'`);
    var query_request_details=`SELECT name, msg
    FROM public.profile where uid='`+obj.uid+`';`
    client.query(query_request_details,function(err,profile_result){
        if (err) {
            console.log("err = " + err);
            return;
        } 
        else
        {
            console.log(profile_result);
            if(profile_result.rowCount==0){
                name='nearby person';
                msg='Help needed immediately';
            }
            else {
                name=profile_result.rows[0].name;
                msg=profile_result.rows[0].msg;
                }
        }
    });

    var query_alert=`select foo.token from (
                      Select ST_DWithin(a.where_is, ST_POINT('`+obj.lat+`', '`+obj.long+`') , 3000)
                      as new_dist,b.token,b.uid from public.all_users a,public.fcm_token b 
                      where a.uid=b.uid 
                      order by new_dist asc
                      limit 10) as foo where foo.uid<> '`+obj.uid+`'`

    client.query(query_alert, function (err, result) {
        client.end();
        if (err) {
            console.log("err = " + err);
            return;
        } 
        else 
        {   if(result.rowCount>0)
            {
                result.rows.forEach(function(row,index){
                  var message = { 
                                  to:row.token,
                                  notification: {
                                        title: name+':,:'+obj.uid, 
                                        body: msg+' location details are:'+obj.lat+','+obj.long},      
                                };
                  fcm.send(message, function(err, response){
                      if (err) {
                          console.log("Something has gone wrong at sending push notification :"+err)
                      } else {
                          console.log("Successfully sent with response: "/*, response*/)
                      }
                  });
                
            });}
            else {console.log("no contacts in the locality found");}
        }
    });    
  });
}


function main_table(obj) {
  var client= new pg.Client(connectionString);
  client.connect(function(err) {
    if (err) {
      return console.log("err = " + err);
    }
    var query_alert=`BEGIN;SET TRANSACTION ISOLATION LEVEL SERIALIZABLE READ WRITE;
                    INSERT INTO public.all_users (uid,lat,long,where_is)  values 
                    ('`+obj.uid+`','`+obj.lat+`', '`+obj.long+`',ST_POINT('`+obj.lat+`', '`+obj.long+`'))
                    ON CONFLICT (uid)
                    DO UPDATE SET lat=EXCLUDED.lat,long=EXCLUDED.long,where_is=ST_POINT('`+obj.lat+`', '`+obj.long+`');
                    COMMIT;`

    client.query(query_alert, function (err, result) {
      client.end();
      if (err) {
          console.log("err = " + err);
          return;
      } else {
          console.log("in main_table");
      }
    });
  });    
}


function heatmap(obj,cb){

  var client= new pg.Client(connectionString);
  client.connect(function(err) {
    if (err) {
      return console.log("err = " + err);
    }
    var query_alert=`SELECT count(*)
                      FROM public.all_users u
                      where ST_DWithin(u.where_is, ST_POINT('`+obj.lat+`', '`+obj.long+`') , 3000);`

    client.query(query_alert, function (err, result) {
      client.end();
      if (err) {
          console.log("err = " + err);
          return;
      } else {
          result.rows.forEach(function(row,index){
              return cb(row.count);
              });
      }
    });
    
  });
}



function contacts(obj,cb){

  var client= new pg.Client(connectionString);
  client.connect(function(err) {
    if (err) {
      return console.log("err = " + err);
    }
    var query_alert=`select exists(select 1 from public.profile where email='`+obj.email+`' and pwd='`+obj.pwd+`');`

    client.query(query_alert, function (err, result) {
      client.end();
      if (err) {
          console.log("err = " + err);
          return;
      } else {
        console.log("user exists - "+result.rows[0].exists);
              return cb(result.rows[0].exists);
      }
    });
    
  });
}


var http = require('http')  
var port = 4000
var fcm = new FCM(serverKey);
var requestHandler = (request, response) => { 
     

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
            }
            else if(obj.table=="heat_map"){
                heatmap(obj, function(vals){
                  console.log(vals);
                  response.on('error', (err) => {
                  console.error(err);
                  });
                  response.end(vals);
                });
            }
            
            else if(obj.table=="contacts"){
                contacts(obj, function(vals){
                  console.log(vals);
                  response.on('error', (err) => {
                  console.error(err);
                  });
                  response.end(vals);
                });
            }
            
            else {
                console.log("");//request not matching any table number
            }           
            
        });
console.log("I'm available");
  
}

var server = http.createServer(requestHandler)

server.listen(port, (err) => {  
    
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
    
})