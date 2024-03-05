const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let responseMessage;
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
            let sql_query = "SELECT C.id_requests, U.name, U.surname, U.nickname, U.user_id, U.uri_profile_image FROM connection_requests AS C JOIN users AS U ON C.sender_user = U.user_id WHERE C.receiver_user = ?;";
            
            connection.query(sql_query, [user_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                	connection.end(); 
                        
                    let responseMessage = {
                    	requests: []
                    };
                    
                    for(let i=0;i<result.length;i++){
                    	responseMessage.requests.push({
                        	"id_requests": result[i].id_requests,
                        	"name": result[i].name,
                       	 	"surname": result[i].surname,
                            "nickname": result[i].nickname,
                            "user_id": result[i].user_id,
                            "uri_profile_image": result[i].uri_profile_image
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