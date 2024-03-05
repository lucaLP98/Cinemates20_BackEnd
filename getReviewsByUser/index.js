const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');
const https = require('https');

exports.handler = (event, context, callback) => {
    let user_id;
    let responseMessage;
    
    if (event.queryStringParameters && event.queryStringParameters.user_id){
        user_id = event.queryStringParameters.user_id;
    }else{
        user_id = null;
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
        
            let sql_query = "SELECT * FROM reviews WHERE user_owner = ?;";
            
            connection.query(sql_query, [user_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    connection.end(); 
                    
                    let i;
                    let responseMessage = {
                        reviews: []
                    };
                    
                    for(i=0;i<result.length;i++){
                        responseMessage.reviews.push({
                            "id_review": result[i].id_review,
                            "vote": result[i].vote,
                            "description": result[i].description,
                            "user_owner": result[i].user_owner,
                            "id_film": result[i].id_film, 
                            "film_title": result[i].film_title,
                            "film_poster": result[i].film_poster
                        });
                    }
                    
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
}; 