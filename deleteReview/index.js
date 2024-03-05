const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let review_id;
    let responseMessage;
    
    if (event.queryStringParameters && event.queryStringParameters.review_id){

        review_id = event.queryStringParameters.review_id;
    }else{
        review_id = null;
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
            let sql_query = "DELETE FROM reviews WHERE id_review = ?;";
            
            connection.query(sql_query, [review_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    connection.end(); 
                    
                    //respons preparation
                    responseMessage = "success";
                    
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "text/html"
                        },
                        "multiValueHeaders": { 
                            
                        },
                        "body": responseMessage,
                        "isBase64Encoded": false
                    };
                    
                    //return response to client
                    callback(null, response);
                }
            }); 
        }
    });
}; 