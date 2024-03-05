const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let review_id;
    let vote, description;
    let responseMessage, requestBody;
    
    if(event.body){
        requestBody = JSON.parse(event.body);
    }else{
        callback("error");
    }
    
    if (requestBody.review_id && requestBody.vote && requestBody.description){
        review_id = requestBody.review_id;
        vote = requestBody.vote;
        description = requestBody.description;
    }else{
        review_id = null;
        vote = null;
        description = null;
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
            let sql_query = "UPDATE reviews SET vote=?, description=? WHERE id_review=?;";
            
            connection.query(sql_query, [vote, description, review_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    connection.end(); 
					                    
                    //respons preparation
                    responseMessage = { "message": "success"};
                    
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "multiValueHeaders": { 
                            
                        },
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