const mysql = require("mysql2");

// COMMENT: Creates a connection to your MySQL database
const eTrackerConn = mysql.createConnection({
     host: "localhost", // COMMENT: Enter the location of your MySQL database. If it is hosted on your local machine, use 'localhost'. If it is hosted on a server, enter the server's IP address.
     port: 3306, // COMMENT: Enter the port your MySQL database is running on. If you are using the default port, enter 3306.
     user: "root", // COMMENT: Enter the username used to access your database.
     password: "root", // COMMENT: Enter the password used to access your database.
});

export default eTrackerConn;
