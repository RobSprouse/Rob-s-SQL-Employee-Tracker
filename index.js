import inquirer from "inquirer";
import fs from "fs";
import { setupConnection, eventEmitter, eTracker, setupDatabase } from "./config/connection.js";
import printTable from "console-table-printer";

setupConnection();
setupDatabase();

async function eTrackerQuery (sqlQuery) {
     const [rows, fields] = await eTracker.query(sqlQuery);
     printTable.printTable(rows)
};

const options = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to do?",
          choices: [
               "View All Departments",
               "View All Roles",
               "View All Employees",
               "Add a Department",
               "Add a Role",
               "Add an Employee",
               "Update an Employee Role",
               "Quit",
          ],
     },
];

const optionsHandler = (optionChoices) => {
     switch (optionChoices) {
          case "View All Departments":
               return eTrackerQuery("SELECT * FROM department");
          case "View All Roles":
               return eTrackerQuery("SELECT * FROM role");
          case "View All Employees":
               return eTrackerQuery("SELECT * FROM employee");
          case "Quit":
               return ;
     }
};

async function init() {
     try {
          const answers = await inquirer.prompt(options);
          const sqlQuery = optionsHandler(answers.optionChoices);
     } catch (err) {
          console.error(err);
     }
}

const addDepartment = [
     {
          type: "input",
          name: "departmentName",
          message: "What is the name of the department?",
     },
];

const addRole = [
     {
          type: "input",
          name: "roleName",
          message: "What is the name of the role?",
     },
     {
          type: "input",
          name: "roleSalary",
          message: "What is the salary for this role?",
     },
];

const addEmployee = [
     {
          type: "input",
          name: "addFirstName",
          message: "What is the first name of the employee?",
     },
     {
          type: "input",
          name: "addLastName",
          message: "What is the last name of the employee?",
     },
     {
          type: "input",
          name: "employeeRole",
          message: "What is the role of the employee?",
     },
     {
          type: "input",
          name: "employeeManager",
          message: "Who is the employee's manager?",
     },
];

init();
