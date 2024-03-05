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
            let sql_query = "SELECT U.user_id, U.name, U.surname, U.nickname, U.uri_profile_image, F.id_friendship FROM friendship AS F JOIN users AS U ON F.first_user = U.user_id WHERE F.second_user = ?";
            sql_query = sql_query + " UNION ";
            sql_query = sql_query + "SELECT U.user_id, U.name, U.surname, U.nickname, U.uri_profile_image, F.id_friendship FROM friendship AS F JOIN users AS U ON F.second_user = U.user_id WHERE F.first_user = ?;";
            
            connection.query(sql_query, [user_id, user_id], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    connection.end();
                    
                    let responseMessage = {
                        friends: []
                    };
                    
                    for(let i=0;i<result.length;i++){
                        responseMessage.friends.push({
                            "name": result[i].name,
                            "surname": result[i].surname,
                            "nickname": result[i].nickname,
                            "friend_id": result[i].user_id, 
                            "friend_uri_image": result[i].uri_profile_image,
                            "firendship_id": result[i].id_friendship
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



