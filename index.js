import inquirer from "inquirer";
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

async function eTrackerExecute(sqlQuery, params = []) {
     try {
          const [rows, fields] = await eTracker.execute(sqlQuery, params);
          return [rows, fields];
     } catch (err) {
          console.error("\n" + err.sqlMessage + "\n");
          return [null, null];
     }
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
               "Update an Employee's Manager",
               "View Employees by Manager",
               "View Employees by Department",
               "Delete a Department",
               "Delete a Role",
               "Delete an Employee",
               "Quit",
          ],
     },
];

const optionsHandler = async (optionChoices) => {
     switch (optionChoices) {
          case "View All Departments":
               return eTrackerPrint(
                    `SELECT department.id AS 'Department ID',
                    department.name AS 'Department Name'
                    FROM department`
               );
          case "View All Roles":
               return eTrackerPrint(
                    `SELECT role.id AS 'Role ID',
                    role.title AS 'Role Title',
                    department.name AS 'Department Name',
                    role.salary AS 'Salary'
                    FROM
                    role JOIN department ON role.department_id = department.id`
               );
          case "View All Employees":
               return eTrackerPrint(
                    `SELECT employee.id AS 'Employee ID', 
                         employee.first_name AS 'First Name', 
                         employee.last_name AS 'Last Name', 
                         role.title AS 'Title', 
                         department.name AS 'Department', 
                         role.salary AS 'Salary', 
                         CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
                         FROM employee
                         LEFT JOIN role ON employee.role_id = role.id
                         LEFT JOIN department ON role.department_id = department.id
                         LEFT JOIN employee manager ON manager.id = employee.manager_id`
               );

          case "Add a Department":
               const addDepartmentAnswer = await inquirer.prompt(addDepartment);
               // await eTrackerExecute(`INSERT INTO department (name) VALUES ('${addDepartmentAnswer.departmentName}')`);
               const [rows, fields] = await eTracker.query(
                    `INSERT INTO department (name) VALUES ('${addDepartmentAnswer.departmentName}')`
               );
               console.log("rows =" + rows + " fields =" + fields);
               console.log(`\nThe department ${addDepartmentAnswer.departmentName} has been added to the database.\n`);
               break;
          case "Add a Role":
               console.log("\nRefer to this Department Table when assigning the id of the Department to the role.");
               await eTrackerPrint(
                    "SELECT department.id AS 'Department ID', department.name AS 'Department Name' FROM department"
               );

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
          case "Update an Employee Role":
               const employees = await eTrackerGetValues("SELECT * FROM employee");
               const employeeNames = employees.map((employee) => ({
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
               }));
               const roles2 = await eTrackerGetValues("SELECT * FROM role");
               const roleChoices2 = roles2.map((role) => ({ name: role.title, value: role.id }));
               const updateEmployeeAnswers = await inquirer.prompt([
                    {
                         type: "list",
                         name: "employeeId",
                         message: "Which employee would you like to update?",
                         choices: employeeNames,
                    },
                    {
                         type: "list",
                         name: "newRoleId",
                         message: "What is the new role ID for this employee?",
                         choices: roleChoices2,
                    },
               ]);
               await eTracker.execute(`UPDATE employee SET role_id = ? WHERE id = ?`, [
                    updateEmployeeAnswers.newRoleId,
                    updateEmployeeAnswers.employeeId,
               ]);
               console.log(`\nThe employee's role has been updated.\n`);
               break;
          case "Update an Employee's Manager":
               const employees2 = await eTrackerGetValues("SELECT * FROM employee");
               const employeeNames2 = employees2.map((employee) => ({
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
               }));
               const managers = await eTrackerGetValues("SELECT * FROM employee");
               const managerNames2 = managers.map((manager) => ({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id,
               }));
               const updateEmployeeAnswers2 = await inquirer.prompt([
                    {
                         type: "list",
                         name: "employeeId",
                         message: "Which employee would you like to update?",
                         choices: employeeNames2,
                    },
                    {
                         type: "list",
                         name: "newManagerId",
                         message: "What is the new manager ID for this employee?",
                         choices: managerNames2,
                    },
               ]);
               await eTracker.execute(`UPDATE employee SET manager_id = ? WHERE id = ?`, [
                    updateEmployeeAnswers2.newManagerId,
                    updateEmployeeAnswers2.employeeId,
               ]);
               console.log(`\nThe employee's manager has been updated.\n`);
               break;
          case "View Employees by Manager":
               const managers2 = await eTrackerGetValues("SELECT * FROM employee");
               const managerNames3 = managers2.map((manager) => ({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id,
               }));
               const managerAnswer = await inquirer.prompt([
                    {
                         type: "list",
                         name: "managerId",
                         message: "Which manager's employees would you like to view?",
                         choices: managerNames3,
                    },
               ]);
               await eTrackerPrint(
                    `SELECT employee.id AS 'Employee ID', 
                         employee.first_name AS 'First Name', 
                         employee.last_name AS 'Last Name', 
                         role.title AS 'Title', 
                         department.name AS 'Department', 
                         role.salary AS 'Salary', 
                         CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
                         FROM employee
                         LEFT JOIN role ON employee.role_id = role.id
                         LEFT JOIN department ON role.department_id = department.id
                         LEFT JOIN employee manager ON manager.id = employee.manager_id
                         WHERE employee.manager_id = ${managerAnswer.managerId}`
               );
               break;
          case "View Employees by Department":
               const departments = await eTrackerGetValues("SELECT * FROM department");
               const departmentNames = departments.map((department) => ({
                    name: department.name,
                    value: department.id,
               }));
               const departmentAnswer = await inquirer.prompt([
                    {
                         type: "list",
                         name: "departmentId",
                         message: "Which department's employees would you like to view?",
                         choices: departmentNames,
                    },
               ]);
               await eTrackerPrint(
                    `SELECT employee.id AS 'Employee ID', 
                         employee.first_name AS 'First Name', 
                         employee.last_name AS 'Last Name', 
                         role.title AS 'Title', 
                         department.name AS 'Department', 
                         role.salary AS 'Salary', 
                         CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
                         FROM employee
                         LEFT JOIN role ON employee.role_id = role.id
                         LEFT JOIN department ON role.department_id = department.id
                         LEFT JOIN employee manager ON manager.id = employee.manager_id
                         WHERE department.id = ${departmentAnswer.departmentId}`
               );
               break;
          case "Delete a Department":
               const departments2 = await eTrackerGetValues("SELECT * FROM department");
               const departmentNames2 = departments2.map((department) => ({
                    name: department.name,
                    value: department.id,
               }));
               const departmentAnswer2 = await inquirer.prompt([
                    {
                         type: "list",
                         name: "departmentId",
                         message: "Which department would you like to delete?",
                         choices: departmentNames2,
                    },
               ]);
               const [rows2, fields2] = await eTrackerExecute(`DELETE FROM department WHERE id = ?`, [
                    departmentAnswer2.departmentId,
               ]);
               if (rows2 === null && fields2 === null) {
                    return;
               }
               console.log(`\nThe department has been deleted.\n`);
               break;

          case "Delete a Role":
               const roles3 = await eTrackerGetValues("SELECT * FROM role");
               const roleChoices3 = roles3.map((role) => ({ name: role.title, value: role.id }));
               const roleAnswer = await inquirer.prompt([
                    {
                         type: "list",
                         name: "roleId",
                         message: "Which role would you like to delete?",
                         choices: roleChoices3,
                    },
               ]);
               await eTracker.execute(`DELETE FROM role WHERE id = ?`, [roleAnswer.roleId]);
               console.log(`\nThe role has been deleted.\n`);
               break;
          case "Delete an Employee":
               const employees3 = await eTrackerGetValues("SELECT * FROM employee");
               const employeeNames3 = employees3.map((employee) => ({
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id,
               }));
               const employeeAnswer = await inquirer.prompt([
                    {
                         type: "list",
                         name: "employeeId",
                         message: "Which employee would you like to delete?",
                         choices: employeeNames3,
                    },
               ]);

               await eTracker.execute(`DELETE FROM employee WHERE id = ?`, [employeeAnswer.employeeId]);
               console.log(`\nThe employee has been deleted.\n`);
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
