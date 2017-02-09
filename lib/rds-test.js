var mysql = require('mysql');


var exports={},
    dbConfig={
        host: '10.154.255.93',
        user: 'zard',
        password: '!Zard123',
        database:'dwl008',
        port: 3306
    },
    conn = mysql.createConnection(dbConfig);

exports.createTable=function(){
    conn.connect();
    conn.query(['CREATE TABLE Persons',
    '(',
        'PersonId int NOT NULL,',
        'FirstName varchar(15),',
        'LastName varchar(15),',
        'Age int',
    ')'].join(''), function(err, rows, fields) {
        if (err) throw err;
    });
    conn.end();
};

exports.select=function(){
    return new Promise(function(resolve, reject){
        conn.connect();
        conn.query('SELECT * FROM Persons', function(err, rows, fields) {
            console.log('The solution is: ', JSON.stringify(arguments));
            if (err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
        conn.end();
    });
};

exports.insert=function(){
    conn.connect();
    conn.query('INSERT INTO Persons VALUES(1,"JF","BOB",19)', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ',JSON.stringify(rows[0]) );
    });
    conn.end();
};


module.exports = exports;