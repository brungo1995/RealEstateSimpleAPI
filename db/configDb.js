const mysql = require('mysql');

module.exports = con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3300
});

