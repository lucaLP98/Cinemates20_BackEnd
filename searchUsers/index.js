const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    let nickname, name, surname;
    
    if (event.queryStringParameters && event.queryStringParameters.nickname){
        nickname = event.queryStringParameters.nickname;
    }else if (event.queryStringParameters && event.queryStringParameters.name && event.queryStringParameters.surname){
        name = event.queryStringParameters.name;
        surname = event.queryStringParameters.surname;
    }else{
        nickname = null;
        surname = null;
        name = null;
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
            let sql_query;
            let param1, param2, param3;
            
            if(nickname == null){
                sql_query = "SELECT name, surname, nickname, uri_profile_image, user_id FROM users WHERE (name LIKE ? AND surname LIKE ?);";
                param1 = "%"+name+"%";
                param2 = "%"+surname+"%";
                param3 = null;
            }else{
                sql_query = "SELECT name, surname, nickname, uri_profile_image, user_id FROM users WHERE (nickname LIKE ? OR name LIKE ? OR surname LIKE ?);";
                param1 = "%"+nickname+"%";
                param2 = "%"+nickname+"%";
                param3 = "%"+nickname+"%";
            }
            
            connection.query(sql_query, [param1, param2, param3], function (err, result){
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    connection.end();
                    
                    let responseMessage = {
                        users: []
                    };
                    
                    for(let i=0;i<result.length;i++){
                        responseMessage.users.push({
                            "name": result[i].name,
                            "surname": result[i].surname,
                            "nickname": result[i].nickname,
                            "uri_image": result[i].uri_profile_image,
                            "user_id": result[i].user_id
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