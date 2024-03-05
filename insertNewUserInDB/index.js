const AWS = require('aws-sdk')
const mysql = require('./node_modules/mysql')

exports.handler = (event, context, callback) => {
    
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
            let name = event.request.userAttributes.given_name;
            let surname = event.request.userAttributes.family_name;
            let nickname = event.request.userAttributes.nickname;
            let email = event.request.userAttributes.email;
		    let user_id = event.request.userAttributes.sub;
            let bio = "Hi there! I am using Cinemates20.";
        
            let sql_query = "INSERT INTO users(user_id, email, name, surname, nickname, biography) VALUES (?, ?, ?, ?, ?, ?)";
            
            connection.query(sql_query, [user_id, email, name, surname, nickname, bio], function (err, result) {
                if (err){
                    connection.destroy();
                    callback(err);
                }else{
                    connection.end();
                    callback(null, event);
                }
            }); 
        }
        
    });
}; 