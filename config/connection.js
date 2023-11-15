// COMMENT: Imports the required modules
import mysql from "mysql2/promise.js";
import printTable from "console-table-printer";

let eTracker;

// COMMENT: Function to connect to the host database
async function setupConnection() {
     try {
          eTracker = await mysql.createConnection({
               host: "localhost", // Host location, default MySQL configuration
               port: 3306, // Port, default MySQL configuration
               user: "root", // Change to your MySQL username
               password: "root", // Change to your MySQL password
          });
          console.log("\nConnected to the host location.\n");
     } catch (err) {
          console.error(
               "\nThere was a problem connecting to the host location. See the following error response for details.\n" +
                    err
          );
     }
}

// COMMENT: Function to create the database and tables if they don't exist
async function setupDatabase() {
     try {
          const tables = [
               // Array of SQL queries to create the tables if they don't exist
               `CREATE TABLE IF NOT EXISTS department (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(30) NOT NULL,
                PRIMARY KEY (id)
            )`,
               `CREATE TABLE IF NOT EXISTS role (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(30) NOT NULL,
                salary DECIMAL NOT NULL,
                department_id INT,
                PRIMARY KEY (id),
                FOREIGN KEY (department_id) REFERENCES department(id)
            )`,
               `CREATE TABLE IF NOT EXISTS employee (
                id INT NOT NULL AUTO_INCREMENT,
                first_name VARCHAR(30) NOT NULL,
                last_name VARCHAR(30) NOT NULL,
                role_id INT,
                manager_id INT DEFAULT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (role_id) REFERENCES role(id),
                FOREIGN KEY (manager_id) REFERENCES employee(id)
            )`,
          ];

          await eTracker.query("CREATE DATABASE IF NOT EXISTS employee_tracker"); // Creates the database if it doesn't exist
          await eTracker.query("USE employee_tracker"); // Uses the database

          await Promise.all(tables.map((table) => eTracker.query(table))); // A promise that creates the tables if they don't exist by mapping through the tables array and executing each query

          console.log("\nConnected to the Employee Database and it's ready for use.\n");
          // COMMENT: https://ascii-generator.site/ was used to generate the ASCII art
          console.log(`
          oooooooooo    ooooooo   oooooooooo   888  oooooooo8    oooooooo8    ooooooo   ooooo       
          888    888 o888   888o  888    888  888 888          888         o888   888o  888        
          888oooo88  888     888  888oooo88  o88   888oooooo    888oooooo  888     888  888        
          888  88o   888o   o888  888    888              888          888 888o  8o888  888      o 
         o888o  88o8   88ooo88   o888ooo888       o88oooo888   o88oooo888    88ooo88   o888ooooo88 
                                                                                  88o8             
         ooooooooooo oooo     oooo oooooooooo  ooooo         ooooooo   ooooo  oooo ooooooooooo ooooooooooo 
          888    88   8888o   888   888    888  888        o888   888o   888  88    888    88   888    88  
          888ooo8     88 888o8 88   888oooo88   888        888     888     888      888ooo8     888ooo8    
          888    oo   88  888  88   888         888      o 888o   o888     888      888    oo   888    oo  
         o888ooo8888 o88o  8  o88o o888o       o888ooooo88   88ooo88      o888o    o888ooo8888 o888ooo8888 
                                                                                                           
         ooooooooooo oooooooooo       o        oooooooo8 oooo   oooo ooooooooooo oooooooooo  
         88  888  88  888    888     888     o888     88  888  o88    888    88   888    888 
             888      888oooo88     8  88    888          888888      888ooo8     888oooo88  
             888      888  88o     8oooo88   888o     oo  888  88o    888    oo   888  88o   
            o888o    o888o  88o8 o88o  o888o  888oooo88  o888o o888o o888ooo8888 o888o  88o8 
                                                                                             
         \n`);
     } catch (err) {
          // Catches any errors and prints them to the console
          console.error(
               "\nThere was a problem either creating or connecting to the Employee Database. See the following error response for details.\n" +
                    err
          );
     }
}

// COMMENT: Functions that utilize the connection to the database to print and execute SQL queries

// COMMENT: Prints the table in the console
async function eTrackerPrint(sqlQuery, params = []) {
     try {
          console.log("\n"); // Adds a line break before the table for readability
          const [tableContent, mysql2Query] = await eTracker.execute(sqlQuery, params); // deconstructs the response from the database
          printTable.printTable(tableContent); // Prints the tableContent response in the console
          console.log("\n");
          return [tableContent, mysql2Query];
     } catch (err) {
          // Catches any errors, prints them to the console, and returns null for error handling
          console.error("\nMySql Error:" + err.sqlMessage + "\n");
          return [null, null];
     }
}

// COMMENT: Function to executes the SQL query that is passed into it
async function eTrackerExecute(sqlQuery, params = []) {
     try {
          const [res, fields] = await eTracker.execute(sqlQuery, params);
          return [res, fields];
     } catch (err) {
          console.error("\n MySql Error: " + err.sqlMessage + "\n");
          return [null, null];
     }
}

// COMMENT: Exports the functions
export { setupDatabase, setupConnection, eTracker, eTrackerPrint, eTrackerExecute };
