var FCM = require('fcm-push');

var serverKey = 'AAAAAlXppOM:APA91bEVEkKZ1sSzu7cx3jmxJGmTdnKsOrHevlOKMXH_KkYk6g-Gvfxs2sMmRu-HI2nKNo6R6TULST-Ml5zcmh93NwT5RMyjYFv-51ZfBAbCRL0yG8ZkfMf-UW0JIHd5_cimRfnXf8fE';
var fcm = new FCM(serverKey);
var message = {
    to: 'fnsELZ3z7QQ:APA91bFnCxnhxnmQJkLH2-3u8mYl1uPH0ibDy01NYSpD07pNuBiVZbrIa-lKmQbeJC3p2XbGQlTicd0DZERe1oaQ5dkkCbnMx7_XIyRSyormuGHCY59hHMv2tnd4V35CjbfwtjtSOqQU', 
    data: {
        'message': '33.4255,111.9400'
    },
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};

//callback style
fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});

//promise style
fcm.send(message)
    .then(function(response){
        console.log("Successfully sent with response: ", response);
    })
    .catch(function(err){
        console.log("Something has gone wrong!");
        console.error(err);
    })

