const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let user_id;
    let userPoolID = 'us-east-2_XmVrbqS7s';
    let name, surname, nickname, biography;
    let responseMessage, requestBody;
    
    if(event.body){
        requestBody = JSON.parse(event.body);
    }else{
        callback("error");
    }
    
    if (requestBody.user_id && requestBody.name && requestBody.surname && requestBody.nickname && requestBody.biography){
        user_id = requestBody.user_id;
        name = requestBody.name;
        surname = requestBody.surname;
        nickname = requestBody.nickname;
        biography = requestBody.biography;
    }else{
        user_id = null;
        name = null;
        surname = null;
        nickname = null;
        biography = null;
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
            let sql_query = "UPDATE users SET name=?, surname=?, nickname=?, biography=? WHERE user_id=?;";
            
            connection.query(sql_query, [name, surname, nickname, biography, user_id], function (err, result) {
                if (err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    connection.end(); 
                    
                    //update user data in Cognito User Pool
                    let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
                    
                    let param = {
                        UserAttributes: [
                            {Name: 'nickname', Value: nickname},
                            {Name: 'given_name', Value: name},
                            {Name: 'family_name', Value: surname}
                        ], 
                        
                        UserPoolId: userPoolID, 
                        Username: user_id 
                    };
                    
                    cognitoIdentityServiceProvider.adminUpdateUserAttributes(param, function(err, data){
                        if (err) console.log(err, err.stack); // an error occurred
                        else     console.log(data);           // successful response
                    });
                    
                    //respons preparation
                    responseMessage = { "messagre": "success"};
                    
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