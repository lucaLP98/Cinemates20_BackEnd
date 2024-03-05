const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let friendship_id;
    
    if (event.queryStringParameters && event.queryStringParameters.friendship_id){
        friendship_id = event.queryStringParameters.friendship_id;
    }else{
        friendship_id = null;
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
            let sql_query = "DELETE FROM friendship WHERE id_friendship = ?";
            
            connection.query(sql_query, [friendship_id], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    connection.end();
                    
                    let responseMessage = "success";
                    
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "multiValueHeaders": { },
                        "body": responseMessage,
                        "isBase64Encoded": false
                    };
                    
                    callback(null, response);
                }
            }); 
        }
    });
}; 



