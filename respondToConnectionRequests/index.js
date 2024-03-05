const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let request_id, receiver, sender, requestResponse, notifyText, notifyType;
    let bodyRequest;
    
    if(event.body)
        bodyRequest = JSON.parse(event.body);
    else
        callback(null, "error");

    
    if(bodyRequest.request_id && bodyRequest.receiver && bodyRequest.sender && bodyRequest.requestResponse && bodyRequest.notifyText && bodyRequest.notifyType){
        request_id = bodyRequest.request_id;
        receiver = bodyRequest.receiver;
        sender = bodyRequest.sender;
        requestResponse = bodyRequest.requestResponse;
        notifyText = bodyRequest.notifyText;
        notifyType = bodyRequest.notifyType;
    }else{
        request_id = null;
        receiver = null;
        sender = null;
        requestResponse = null;
        notifyText = null;
        notifyType = null;
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
            let queryDeleteRequest = "DELETE FROM connection_requests WHERE id_requests = ?";
            
            connection.query(queryDeleteRequest, [request_id], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                
                    if(requestResponse == 1){
                        let queryAddFriendship = "INSERT INTO friendship(first_user, second_user) VALUES(?, ?);";
                        
                        connection.query(queryAddFriendship, [sender, receiver], function (err, result){
                            if(err){
                                connection.destroy();
                                callback(err);
                            }
                        });
                    }
                    
                    
                    let queryAddNotification = "INSERT INTO notifications(text, user_id, notification_type) VALUES(?, ?, ?);";
                            
                    connection.query(queryAddNotification, [notifyText, sender, notifyType], function (err, result){
                        if(err){
                            connection.destroy();
                            callback(err);
                        }else{
                            connection.end();
                        }
                    });
                    
                    let responseMessage = {
                        "message": "successo"
                        
                    };
                    
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "text/html"
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
}; 



