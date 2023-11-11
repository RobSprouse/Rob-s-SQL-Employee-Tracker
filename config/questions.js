// TODO: Create the following options for the user to choose from:
// [ ]: view all departments
// [ ]: view all roles
// [ ]: view all employees
// [ ]: add a department
// [ ]: add a role
// [ ]: add an employee
// [ ]: update an employee role

import inquirer from "inquirer";
import { eTracker } from "./connection";

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

optionsHandler = (optionChoices) => {
     switch (optionChoices) {
          case "View All Departments":
               return "SELECT * FROM department";
          case "View All Roles":
               return "SELECT * FROM role";
          case "View All Employees":
               return "SELECT * FROM employee";
     }
};

function init() {
     inquirer.prompt(options).then((answers) => {
          eTracker.query(optionsHandler(answers.optionChoices), (err, res) => {
               if (err) throw err;
               console.table(res);
               init();
          });
     });
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
