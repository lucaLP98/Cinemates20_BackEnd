const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let user_sender, user_receiver, movie_id, notification_text, notification_type;
    let requestBody;
    
    if(event.body){
        requestBody = JSON.parse(event.body);
    }else{
        callback("error");
    }
    
    if (requestBody.user_sender && requestBody.user_receiver &&  requestBody.notification_text && requestBody.notification_type && requestBody.movie_id){
        user_sender = requestBody.user_sender;
        user_receiver = requestBody.user_receiver;
        notification_text = requestBody.notification_text;
        notification_type = requestBody.notification_type;
        movie_id = requestBody.movie_id;
    }else{
        user_sender = null;
        user_receiver = null;
        notification_text = null;
        notification_type = null;
        movie_id = null;
    }
    
   let connection = mysql.createConnection({
        host: "cinemates20-database.ch2dxxj8rth5.us-east-2.rds.amazonaws.com",
        user: "mysqladmin",
        password: "2304yir6tN98",
        database: "cinemates_db"
    });
   
    connection.connect(function(err) {
        if (err){
            callback(err);
        }else{
            let queryInsertSharing = "INSERT INTO movie_sharing(sender_user, receiver_user, id_film) VALUES(?, ?, ?);";
            
            connection.query(queryInsertSharing, [user_sender, user_receiver, movie_id], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    let queryInsertNotification = "INSERT INTO notifications(text, user_id, notification_type, id_film) VALUES(?, ?, ?, ?);";
                    
                    connection.query(queryInsertNotification, [notification_text, user_receiver, notification_type, movie_id], function (err, result){
                         if (err){
                            connection.destroy();
                            callback(err);
                        }else{
                            connection.end();
                            
                            let responseMessage ={
                                "message": "success"
                            };
                            
                            let response = {
                                "statusCode": 200,
                                "headers": {
                                    "Content-Type": "application/json"
                                },
                                "multiValueHeaders": { },
                                "body": JSON.stringify(responseMessage),
                                "isBase64Encoded": false
                            };
                    
                            callback(null, response);
                        }
                    });
                }
            }); 
        }
    });
}; 