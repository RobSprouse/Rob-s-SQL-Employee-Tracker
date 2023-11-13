import inquirer from "inquirer";
import { setupConnection, eventEmitter, eTracker, setupDatabase } from "./config/connection.js";
import printTable from "console-table-printer";

const prompt = inquirer.prompt;

setupConnection();
setupDatabase();

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

// COMMENT: Validations
const validateNoInput = (input) => {
     if (input) {
          return true;
     } else {
          return "This value cannot be empty.";
     }
};

// COMMENT:Prompt questions
const departmentName = [
     {
          type: "input",
          name: "departmentName",
          message: "What is the name of the department?",
          validate: validateNoInput,
     },
];

let addRole = [
     {
          type: "input",
          name: "roleName",
          message: "What is the name of the role?",
          validate: validateNoInput,
     },
     {
          type: "input",
          name: "roleSalary",
          message: "What is the salary for this role?",
          validate: validateNoInput,
     },
     {
          type: "list",
          name: "departmentName",
          message: "Which department does this role belong to?",
          choices: [],
     },
];

let addEmployee = [
     {
          type: "input",
          name: "addFirstName",
          message: "What is the first name of the employee?",
          validate: validateNoInput,
     },
     {
          type: "input",
          name: "addLastName",
          message: "What is the last name of the employee?",
          validate: validateNoInput,
     },
     {
          type: "list",
          name: "roleTitles",
          message: "Which role does this employee have?",
          choices: [],
     },
     {
          type: "list",
          name: "employeeManager",
          message: "Who is the employee's manager?",
          choices: [],
     },
];

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

let updateEmployee = [
     {
          type: "list",
          name: "employeeId",
          message: "Which employee would you like to update?",
          choices: [],
     },
     {
          type: "list",
          name: "newRoleTitle",
          message: "What is the new role ID for this employee?",
          choices: [],
     },
];

let updateEmployeeManager = [
     {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: [],
     },
     {
          type: "list",
          name: "newManager",
          message: "What is the new manager for this employee?",
          choices: [],
     },
];

// COMMENT: SQL Queries
const sqlSelectAllDepartments = `
     SELECT
          department.id AS 'Department ID',
          department.name AS 'Department Name'
     FROM
          department`;
const sqlSelectAllRoles = `
     SELECT
          role.id AS 'Role ID',
          role.title AS 'Role Title',
          department.name AS 'Department Name',
          role.salary AS 'Salary'
     FROM
          role
          JOIN department ON role.department_id = department.id`;
const sqlSelectAllEmployees = `
     SELECT
          employee.id AS 'Employee ID',
          employee.first_name AS 'First Name',
          employee.last_name AS 'Last Name',
          role.title AS 'Title',
          department.name AS 'Department',
          role.salary AS 'Salary',
          CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
     FROM
          employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON manager.id = employee.manager_id`;

const sqlAddDepartment = `INSERT INTO department (name) VALUES (?)`;
const sqlAddRole = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
const sqlAddEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
const sqlUpdateEmployeeRole = `UPDATE employee SET role_id = ? WHERE id = ?`;
const sqlUpdateEmployeeManager = `UPDATE employee SET manager_id = ? WHERE id = ?`;

// COMMENT:Map functions
async function getDepartmentNamesAndMap() {
     const [res, fields] = await eTrackerExecute(sqlSelectAllDepartments);
     const departmentNames = res.map((res) => res["Department Name"]);
     const departmentMap = res.reduce((map, obj) => {
          map[obj["Department Name"]] = obj["Department ID"];
          return map;
     }, {});
     return { departmentNames, departmentMap };
}

async function getRoleTitlesAndMap() {
     const [res, fields] = await eTrackerExecute(sqlSelectAllRoles);
     const roleTitles = res.map((res) => res["Role Title"]);
     const roleMap = res.reduce((map, obj) => {
          map[obj["Role Title"]] = obj["Role ID"];
          return map;
     }, {});
     return { roleTitles, roleMap };
}

async function getEmployeeNamesAndMap() {
     const res = await eTrackerExecute(sqlSelectAllEmployees);
     const employeeNames = res[0].map((res) => res["First Name"] + " " + res["Last Name"]);
     const employeeMap = res[0].reduce((map, obj) => {
          map[obj["First Name"] + " " + obj["Last Name"]] = obj["Employee ID"];
          return map;
     }, {});
     return { employeeNames, employeeMap };
}

// COMMENT: Handler function
async function optionsHandler(optionChoices) {
     switch (optionChoices) {
          case "View All Departments":
               return eTrackerPrint(sqlSelectAllDepartments);
          case "View All Roles":
               return eTrackerPrint(sqlSelectAllRoles);
          case "View All Employees":
               return eTrackerPrint(sqlSelectAllEmployees);
          case "Add a Department": {
               return prompt(departmentName).then((res) => {
                    eTrackerExecute(sqlAddDepartment, [res.departmentName]);
                    console.log(`\nThe department ${res.departmentName} has been added to the database.\n`);
               });
          }
          case "Add a Role": {
               let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
               addRole[2].choices = departmentNames;
               return await prompt(addRole).then(async (res) => {
                    await eTrackerExecute(sqlAddRole, [
                         res.roleName,
                         res.roleSalary,
                         departmentMap[res.departmentName],
                    ]);
                    console.log(`\nThe role ${res.roleName} has been added to the database.\n`);
               });
          }
          case "Add an Employee": {
               let { roleTitles, roleMap } = await getRoleTitlesAndMap();
               let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
               addEmployee[2].choices = roleTitles;
               addEmployee[3].choices = employeeNames; // TODO: need to add a null option to this list
               return await prompt(addEmployee).then(async (res) => {
                    await eTrackerExecute(sqlAddEmployee, [
                         res.addFirstName,
                         res.addLastName,
                         roleMap[res.roleTitles],
                         res.employeeManager === 0 ? null : employeeMap[res.employeeManager],
                    ]);
                    console.log(
                         `\nThe employee ${res.addFirstName} ${res.addLastName} has been added to the database.\n`
                    );
               });
          }

          case "Update an Employee Role": {
               let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
               let { roleTitles, roleMap } = await getRoleTitlesAndMap();
               updateEmployee[0].choices = employeeNames;
               updateEmployee[1].choices = roleTitles;
               return await prompt(updateEmployee).then(async (res) => {
                    await eTrackerExecute(sqlUpdateEmployeeRole, [
                         roleMap[res.newRoleTitle],
                         employeeMap[res.employeeId],
                    ]);
                    console.log(`\nThe employee's role has been updated.\n`);
               });
          }
          case "Update an Employee's Manager": {
               let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
               updateEmployeeManager[0].choices = employeeNames;
               updateEmployeeManager[1].choices = employeeNames;
               return await prompt(updateEmployeeManager).then(async (res) => {
                    await eTrackerExecute(sqlUpdateEmployeeManager, [
                         employeeMap[res.newManager],
                         employeeMap[res.employee],
                    ]);
                    console.log(`\nThe employee's manager has been updated.\n`);
               });
          }
          case "View Employees by Manager": // TODO: do this next
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
               const departmentNames2 = departments.map((department) => ({
                    name: department.name,
                    value: department.id,
               }));
               const departmentAnswer = await inquirer.prompt([
                    {
                         type: "list",
                         name: "departmentId",
                         message: "Which department's employees would you like to view?",
                         choices: departmentNames2,
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
               const departmentNames3 = departments2.map((department) => ({
                    name: department.name,
                    value: department.id,
               }));
               const departmentAnswer2 = await inquirer.prompt([
                    {
                         type: "list",
                         name: "departmentId",
                         message: "Which department would you like to delete?",
                         choices: departmentNames3,
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
}

// COMMENT: Init function
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
