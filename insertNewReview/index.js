const AWS = require('aws-sdk');
const mysql = require('./node_modules/mysql');

exports.handler = (event, context, callback) => {
    let user_id, id_film, description, vote, film_title, film_poster;
    let responseMessage = null;
    let nRow=100;
    let statusCode;
    let bodyRequest;
    
    if(event.body)
        bodyRequest = JSON.parse(event.body);
    else
        callback(null, "error");
    
    if(bodyRequest.user_id && bodyRequest.vote && bodyRequest.id_film && bodyRequest.film_poster && bodyRequest.description && bodyRequest.film_title){
        user_id = bodyRequest.user_id;
        id_film = bodyRequest.id_film;
        description = bodyRequest.description;
        vote = bodyRequest.vote;
        film_title = bodyRequest.film_title;
        film_poster = bodyRequest.film_poster;
    }else{
        user_id = null;
        id_film = null;
        description = null;
        vote = null;
		film_title = null;
		film_poster = null;
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
            let sql_verify_review_presence = "SELECT * FROM reviews WHERE id_film = ? AND user_owner = ?;";
            
            connection.query(sql_verify_review_presence, [id_film, user_id], function(err, results) {
                if(err){
                    connection.destroy();
                    
                    callback(err);
                }else{
                    nRow = results.length;
                    
                    if(nRow == 0){
                        let sql_query = "INSERT INTO reviews(vote, description, user_owner, id_film, film_title, film_poster) VALUES (?, ?, ?, ?, ?, ?);";
                
                        connection.query(sql_query, [vote, description, user_id, id_film, film_title, film_poster], function (err, result) {
                            if (err){
                                connection.destroy();
                                callback(err);
                            }else{
                                connection.end(); 
                            }
                        }); 
                    }else{
                        connection.end();
                        responseMessage = {
                            "message": "utente ha già scritto una recensione a questo film"
                        };
                        statusCode = 461;
                    }
                    
                    if(responseMessage == null){
                        responseMessage = {
                            "message": "successo"
                        };
                        statusCode = 200;
                    }
            
                    let response = {
                        "statusCode": statusCode,
                        "headers": {
                          "Content-Type": "application/json"
                        },
                        "multiValueHeaders": {  },
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