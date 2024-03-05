const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let user_id;
    let uri_image;
    let responseMessage;
    let responseBody;
    
    if(event.body){
        responseBody = JSON.parse(event.body);
    }else{
        callback("error");
    }
    
    if (responseBody.user_id && responseBody.uri_image){
        user_id = responseBody.user_id;
        uri_image = responseBody.uri_image;
    }else{
        user_id = null;
        uri_image = null;
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
            
            //Update user data in mysql database
            let sql_query = "UPDATE users SET uri_profile_image=? WHERE user_id=?;";
            
            connection.query(sql_query, [uri_image, user_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    connection.end(); 
                                       
                    //respons preparation
                    responseMessage = {
                        "message": "success"
                    };
                    
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "apllication/json"
                        },
                        "multiValueHeaders": { },
                        "body": JSON.stringify(responseMessage),
                        "isBase64Encoded": false
                    };
                    
                    //return response to client
                    callback(null, response);
                }
            }); 
        }
    });
}; 