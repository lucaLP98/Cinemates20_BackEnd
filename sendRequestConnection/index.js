
const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let userSender, userReceiver, notifyMsg, notifyType;
    let requestBody;
    
    if(event.body){
        requestBody = JSON.parse(event.body);
    }else{
        callback("error");
    }
    
    if (requestBody.userSender && requestBody.userReceiver && requestBody.notifyMsg && requestBody.notifyType){
        userSender = requestBody.userSender;
        userReceiver = requestBody.userReceiver;
        notifyMsg = requestBody.notifyMsg;
        notifyType = requestBody.notifyType;
    }else{
        userSender = null;
        userReceiver = null;
        notifyMsg = null;
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
            connection.destroy();
            callback(err);
        }else{
            let checkAlreadyFriend = "SELECT * FROM friendship WHERE (first_user = ? AND second_user = ?) OR (first_user = ? AND second_user = ?);";
            
            connection.query(checkAlreadyFriend, [userSender, userReceiver, userReceiver, userSender], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else if(result.length > 0){
                    //user sender and user receiver are already friend 
                    connection.end();
                    
                    let respondMessage = {
                        "message": "already_friend"
                    };
                    
                    let response = {
                        "statusCode": 461,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "body": JSON.parse(respondMessage),
                        "multiValueHeaders": { },
                        "isBase64Encoded": false
                    };
                    
                    callback(null, response);
                }else{
                    
                    let checkAlreadyRequestQuery= "SELECT * FROM connection_requests WHERE (sender_user = ? AND receiver_user = ?) OR (sender_user = ? AND receiver_user = ?);";
                    
                    connection.query(checkAlreadyRequestQuery, [userSender, userReceiver, userReceiver, userSender], function (err, result){
                        
                        if(err){
                            connection.destroy();
                            callback(err);
                        }else if(result.length > 0){
                            //user sender(receiver) have already send a request in past to user receiver(sender)
                            connection.end();
                            
                            let respondMessage = {
                                "message": "already_request"
                            };
                    
                            let response = {
                                "statusCode": 462,
                                "headers": {
                                    "Content-Type": "application/json"
                                },
                                "body": JSON.parse(respondMessage),
                                "multiValueHeaders": { },
                                "isBase64Encoded": false
                            };
                            
                            callback(null, response);
                        }else{
                            //There aren't problem, the requests can be sended
                            
                            let insertNewRequestQuery = "INSERT INTO connection_requests(sender_user, receiver_user) VALUES(?, ?);";
                            
                            connection.query(insertNewRequestQuery, [userSender, userReceiver], function(err2, resul2){
                                if(err2){
                                    connection.destroy();
                                    callback(err2);
                                }else{
                                    //connection requests sended
                                    //insert new notification
                                    
                                    let insertNewNotificationQuery = "INSERT INTO notifications(text, user_id, notification_type) VALUES(?, ?, ?);";
                                    connection.query(insertNewNotificationQuery, [notifyMsg, userReceiver, notifyType], function(err3, result3){
                                        
                                        if(err3){
                                            connection.destroy();
                                            callback(err3);
                                        }else{
                                            connection.end();
                                            
                                            let respondMessage = {
                                                "message": "request sended"
                                            };
                                            
                                            let response = {
                                                "statusCode": 200,
                                                "headers": {
                                                    "Content-Type": "application/json"
                                                },
                                                "body": JSON.parse(respondMessage),
                                                "multiValueHeaders": { },
                                                "isBase64Encoded": false
                                             };
                                            
                                            callback(null, response);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }); 
        }
    });
}; 