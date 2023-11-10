import inquirer from "inquirer";
import mysql from "mysql";
import eTrackerConn from "./config/connection";

// COMMENT: Connects to the MySQL database
mysqlConnection.connect((err) => {
     console.log(err ? "Error connecting to the database." : "Connected to the employee_tracker database.");
});
