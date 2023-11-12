import inquirer from "inquirer";
import fs from "fs";
import { setupConnection, eventEmitter, eTracker, setupDatabase } from "./config/connection.js";
import printTable from "console-table-printer";

setupConnection();
setupDatabase();

async function eTrackerPrint(sqlQuery) {
     const [rows, fields] = await eTracker.query(sqlQuery);
     if (rows.length === 0) {
          console.log("\nThere are no records to display.\n");
          return;
     }
     printTable.printTable(rows);
}

async function eTrackerGetValues(sqlQuery) {
     const [rows, fields] = await eTracker.query(sqlQuery);
     if (rows.length === 0) {
          console.log("\nThere are no records to display.\n");
          return;
     }
     return rows;
}

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

const optionsHandler = async (optionChoices) => {
     switch (optionChoices) {
          case "View All Departments":
               return eTrackerPrint("SELECT * FROM department");
          case "View All Roles":
               return eTrackerPrint("SELECT * FROM role");
          case "View All Employees":
               return eTrackerPrint("SELECT * FROM employee");
          case "Add a Department":
               const addDepartmentAnswer = await inquirer.prompt(addDepartment);
               await eTracker.query(`INSERT INTO department (name) VALUES ('${addDepartmentAnswer.departmentName}')`);
               console.log(`\nThe department ${addDepartmentAnswer.departmentName} has been added to the database.\n`);
               break;
          case "Add a Role":
               console.log("\nRefer to this Department Table when assigning the id of the Department to the role.");
               await eTrackerPrint("SELECT * FROM department");
               const addRoleAnswer = await inquirer.prompt(addRole);
               await eTracker.query(
                    `INSERT INTO role (title, salary, department_id) VALUES ('${addRoleAnswer.roleName}', '${addRoleAnswer.roleSalary}', '${addRoleAnswer.departmentId}')`
               );
               console.log(`\nThe role ${addRoleAnswer.roleName} has been added to the database.\n`);
               break;
          case "Add an Employee":
               const roles = await eTrackerGetValues("SELECT * FROM role");
               const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));
               const managerChoices = await eTrackerGetValues("SELECT * FROM employee");
               const managerNames = managerChoices.map((manager) => ({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id,
               }));

               const addEmployeeAnswers = await inquirer.prompt([
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
                         type: "list",
                         name: "roleId",
                         message: "Which role does this employee have?",
                         choices: roleChoices,
                    },
                    {
                         type: "list",
                         name: "employeeManager",
                         message: "Who is the employee's manager?",
                         choices: [...managerNames, { name: "N/A", value: 0 }],
                    },
               ]);
               await eTracker.execute(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    [
                         addEmployeeAnswers.addFirstName,
                         addEmployeeAnswers.addLastName,
                         addEmployeeAnswers.roleId,
                         addEmployeeAnswers.employeeManager === 0 ? null : addEmployeeAnswers.employeeManager,
                    ]
               );

               console.log(
                    `\nThe employee ${addEmployeeAnswers.addFirstName} ${addEmployeeAnswers.addLastName} has been added to the database.\n`
               );
               break;
          case "Quit":
               eTracker.end();
               console.log("\nThank you for using the Employee Tracker. Goodbye!\n");
               return process.exit(0);
     }
};

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
     {
          type: "input",
          name: "departmentId",
          message: "What is the department ID for this role?",
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

async function init() {
     try {
          const answers = await inquirer.prompt(options);
          await optionsHandler(answers.optionChoices);
          init();
     } catch (err) {
          console.error(err);
     }
}

init();
