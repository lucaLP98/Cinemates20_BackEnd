const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let film_id;
    let responseMessage;
    let statusCode;
    let returnRespons;
    let nRow;    
     
    if (event.queryStringParameters && event.queryStringParameters.film_id){
        film_id = event.queryStringParameters.film_id;
    }else{
        film_id = null;
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
            let sql_query = "SELECT * FROM reviews AS R JOIN users AS U ON R.user_owner = U.user_id WHERE R.id_film = ?;";
            
            connection.query(sql_query, [film_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    nRow = result.length;
                    
                    if(nRow > 0){
                        connection.end(); 
                        
                        statusCode = 200;
                        
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
                                "user_nickname": result[i].nickname,
                                "user_image": result[i].uri_profile_image
                            });
                        }
                        
                        returnRespons = JSON.stringify(responseMessage);
                    }else{
                        connection.end(); 
                        
                        statusCode = 401;
                        
                        returnRespons = "null";
                    }
                    
                    
                    
                    let response = {
                        "statusCode": statusCode,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "multiValueHeaders": { },
                        "body": returnRespons,
                        "isBase64Encoded": false
                    };
                    
                    callback(null, response);
                }
            }); 
        }
    });
}; 