var FCM = require('fcm-node')
    
    var serverKey = require('E:/nodepackage/key.json') //put the generated private key path here     
    
    var fcm = new FCM(serverKey)
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to: 'fnsELZ3z7QQ:APA91bFnCxnhxnmQJkLH2-3u8mYl1uPH0ibDy01NYSpD07pNuBiVZbrIa-lKmQbeJC3p2XbGQlTicd0DZERe1oaQ5dkkCbnMx7_XIyRSyormuGHCY59hHMv2tnd4V35CjbfwtjtSOqQU', 
        notification: {
            title: 'message', 
            body: '33.419536,-111.915952' 
        },
        
        
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })