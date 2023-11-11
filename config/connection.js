import mysql from 'mysql2/promise.js';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();
let eTracker;

const setupConnection = async () => {
    eTracker = await mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
    });
    eventEmitter.emit('connectionReady');
};

const setupDatabase = () => {
     eventEmitter.on("connectionReady", async () => {
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
                department_id INT NOT NULL, 
                PRIMARY KEY (id), 
                FOREIGN KEY (department_id) REFERENCES department(id)
              )`,
                    `CREATE TABLE IF NOT EXISTS employee (
                id INT NOT NULL AUTO_INCREMENT, 
                first_name VARCHAR(30) NOT NULL, 
                last_name VARCHAR(30) NOT NULL, 
                role_id INT NOT NULL, 
                manager_id INT DEFAULT NULL, 
                PRIMARY KEY (id)
              )`,
               ];

               const alterTable = `ALTER TABLE employee 
              ADD FOREIGN KEY (role_id) REFERENCES role(id),
              ADD FOREIGN KEY (manager_id) REFERENCES employee(id)`;

               await eTracker.query("CREATE DATABASE IF NOT EXISTS employee_tracker");
               await eTracker.query("USE employee_tracker");

               await Promise.all(tables.map((table) => eTracker.query(table)));
               await eTracker.query(alterTable);

               console.log("Employee Database Set-up and ready for use.");
          } catch (err) {
               console.error(err);
          }
     });
};

export { setupConnection, eventEmitter, eTracker, setupDatabase };
