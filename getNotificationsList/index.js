const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let user_id;
    
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
            let sql_query = "SELECT * FROM notifications WHERE user_id = ?";
           
            connection.query(sql_query, [user_id], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    connection.end();
                    
                    let responseMessage = {
                        notifications: []
                    };
                    
                    for(let i=0;i<result.length;i++){
                        responseMessage.notifications.push({
                            "id_notification": result[i].id_notification,
                            "text": result[i].text,
                            "notification_type": result[i].notification_type,
                            "id_film": result[i].id_film
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