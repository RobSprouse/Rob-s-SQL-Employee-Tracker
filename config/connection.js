import mysql from "mysql2/promise.js";
import printTable from "console-table-printer";

let eTracker;

const setupConnection = async () => {
     try {
          eTracker = await mysql.createConnection({
               host: "localhost",
               port: 3306,
               user: "root",
               password: "root",
          });
          console.log("\nConnected to the host location.\n");
     } catch (err) {
          console.error(
               "\nThere was a problem connecting to the host location. See the following error response for details.\n" +
                    err
          );
     }
};

const setupDatabase = async () => {
     try {
          const tables = [
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

          await eTracker.query("CREATE DATABASE IF NOT EXISTS employee_tracker");
          await eTracker.query("USE employee_tracker");

          await Promise.all(tables.map((table) => eTracker.query(table)));

          console.log("\nConnected to the Employee Database and it's ready for use.\n");
          console.log(`
                            _                               
          _____ _____ _____| |_____    _____ _____ __       
         | __  |     | __  |_|   __|  |   __|     |  |      
         |    -|  |  | __ -| |__   |  |__   |  |  |  |__    
         |__|__|_____|_____| |_____|  |_____|__  _|_____|   
                                               |__|         
                                                            
          _____ _____ _____ __    _____ __ __ _____ _____   
         |   __|     |  _  |  |  |     |  |  |   __|   __|  
         |   __| | | |   __|  |__|  |  |_   _|   __|   __|  
         |_____|_|_|_|__|  |_____|_____| |_| |_____|_____|  
                                                            
                                                            
          _____ _____ _____ _____ _____ _____ _____         
         |_   _| __  |  _  |     |  |  |   __| __  |        
           | | |    -|     |   --|    -|   __|    -|        
           |_| |__|__|__|__|_____|__|__|_____|__|__|        
                                                            \n`)
     } catch (err) {
          console.error(
               "\nThere was a problem either creating or connecting to the Employee Database. See the following error response for details.\n" +
                    err
          );
     }
};

// COMMENT: Connection functions
async function eTrackerPrint(sqlQuery, params = []) {
     try {
          const [rows, fields] = await eTracker.execute(sqlQuery, params);
          return printTable.printTable(rows);
     } catch (err) {
          console.error("\n" + err.sqlMessage + "\n");
          return [null, null];
     }
}

async function eTrackerExecute(sqlQuery, params = []) {
     try {
          const [res, fields] = await eTracker.execute(sqlQuery, params);
          return [res, fields];
     } catch (err) {
          console.error("\n" + err.sqlMessage + "\n");
          return [null, null];
     }
}

export { setupDatabase, setupConnection, eTracker, eTrackerPrint, eTrackerExecute };
