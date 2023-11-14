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

let updateEmployeeRole = [
     {
          type: "list",
          name: "employeeName",
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

let viewEmployeesByManager = [
     {
          type: "list",
          name: "managers",
          message: "Which manager's employees would you like to view?",
          choices: [],
     },
];

let viewEmployeesByDepartment = [
     {
          type: "list",
          name: "department",
          message: "Which department's employees would you like to view?",
          choices: [],
     },
];

let deleteDepartment = [
     {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: [],
     },
];

let deleteRole = [
     {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: [],
     },
];

let deleteEmployee = [
     {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
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

const sqlAddDepartment = `
     INSERT INTO 
          department (name) 
     VALUES (?)`;
const sqlAddRole = `
     INSERT INTO 
          role (title, salary, department_id) 
     VALUES 
          (?, ?, ?)`;
const sqlAddEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
const sqlUpdateEmployeeRole = `UPDATE employee SET role_id = ? WHERE id = ?`;
const sqlUpdateEmployeeManager = `UPDATE employee SET manager_id = ? WHERE id = ?`;
const sqlViewEmployeesByManager = `
     SELECT 
          employee.id AS 'Employee ID', 
          employee.first_name AS 'First Name', 
          employee.last_name AS 'Last Name', 
          role.title AS 'Title', 
          department.name AS 'Department', 
          role.salary AS 'Salary', 
     CONCAT
          (manager.first_name, ' ', manager.last_name) AS 'Manager'
     FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON manager.id = employee.manager_id
          WHERE employee.manager_id = ?`;
const sqlViewEmployeesByDepartment = `
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
          LEFT JOIN employee manager ON manager.id = employee.manager_id
          WHERE department.id = ?`;
const sqlDeleteDepartment = `DELETE FROM department WHERE id = ?`;
const sqlDeleteRole = `DELETE FROM role WHERE id = ?`;
const sqlDeleteEmployee = `DELETE FROM employee WHERE id = ?`;

// COMMENT:Map functions
async function getDepartmentNamesAndMap() {
     try {
          const [res, fields] = await eTrackerExecute(sqlSelectAllDepartments);
          const departmentNames = res.map((res) => res["Department Name"]);
          const departmentMap = res.reduce((map, obj) => {
               map[obj["Department Name"]] = obj["Department ID"];
               return map;
          }, {});
          return { departmentNames, departmentMap };
     } catch (err) {
          console.log("The getDepartmentNamesAndMap function has caused an error: " + err);
     }
}

async function getRoleTitlesAndMap() {
     try {
          const [res, fields] = await eTrackerExecute(sqlSelectAllRoles);
          const roleTitles = res.map((res) => res["Role Title"]);
          const roleMap = res.reduce((map, obj) => {
               map[obj["Role Title"]] = obj["Role ID"];
               return map;
          }, {});
          return { roleTitles, roleMap };
     } catch (err) {
          console.log("The getRoleTitlesAndMap function has caused an error: " + err);
     }
}

async function getEmployeeNamesAndMap() {
     try {
          const res = await eTrackerExecute(sqlSelectAllEmployees);
          const employeeNames = res[0].map((res) => res["First Name"] + " " + res["Last Name"]);
          const employeeMap = res[0].reduce((map, obj) => {
               map[obj["First Name"] + " " + obj["Last Name"]] = obj["Employee ID"];
               return map;
          }, {});
          return { employeeNames, employeeMap };
     } catch (err) {
          console.log("The getEmployeeNamesAndMap function has caused an error: " + err);
     }
}

// COMMENT: Handler function
async function optionsHandler(optionChoices) {
     try {
          switch (optionChoices) {
               // COMMENT: View all departments
               case "View All Departments":
                    return eTrackerPrint(sqlSelectAllDepartments);
               // COMMENT: View all roles
               case "View All Roles":
                    return eTrackerPrint(sqlSelectAllRoles);
               // COMMENT: View all employees
               case "View All Employees":
                    return eTrackerPrint(sqlSelectAllEmployees);
               // COMMENT: Add a department
               case "Add a Department": {
                    const addDepartment = await prompt(departmentName);
                    eTrackerExecute(sqlAddDepartment, [addDepartment.departmentName]);
                    console.log(`\nThe department ${addDepartment.departmentName} has been added to the database.\n`);
                    break;
               }
               // COMMENT: Add a role
               case "Add a Role": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    addRole[2].choices = departmentNames;
                    const addedRole = await prompt(addRole);
                    await eTrackerExecute(sqlAddRole, [
                         addedRole.roleName,
                         addedRole.roleSalary,
                         departmentMap[addedRole.departmentName],
                    ]);
                    console.log(
                         `\nThe role ${addedRole.roleName} has been added in the ${addedRole.departmentName} department.\n`
                    );
                    break;
               }
               // COMMENT: Add an employee
               case "Add an Employee": {
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    addEmployee[2].choices = roleTitles;
                    addEmployee[3].choices = employeeNames;
                    employeeNames.unshift("None");
                    const addedEmployee = await prompt(addEmployee);
                    await eTrackerExecute(sqlAddEmployee, [
                         addedEmployee.addFirstName,
                         addedEmployee.addLastName,
                         roleMap[addedEmployee.roleTitles],
                         addedEmployee.employeeManager === "None" ? null : employeeMap[addedEmployee.employeeManager],
                    ]);
                    console.log(
                         `\nThe employee ${addedEmployee.addFirstName} ${addedEmployee.addLastName} has been added to the database.\n`
                    );
                    break;
               }
               // COMMENT: Update an employee role
               case "Update an Employee Role": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    updateEmployeeRole[0].choices = employeeNames;
                    updateEmployeeRole[1].choices = roleTitles;
                    const updatedEmployee = await prompt(updateEmployeeRole);
                    await eTrackerExecute(sqlUpdateEmployeeRole, [
                         roleMap[updatedEmployee.newRoleTitle],
                         employeeMap[updatedEmployee.employeeName],
                    ]);
                    console.log(
                         `\nThe ${updatedEmployee.employeeName}'s role has been updated to: ${updatedEmployee.newRoleTitle}\n`
                    );
                    break;
               }
               // COMMENT: Update an employee's manager
               case "Update an Employee's Manager": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    updateEmployeeManager[0].choices = employeeNames;
                    updateEmployeeManager[1].choices = employeeNames;
                    const updatedManager = await prompt(updateEmployeeManager);
                    await eTrackerExecute(sqlUpdateEmployeeManager, [
                         employeeMap[updatedManager.newManager],
                         employeeMap[updatedManager.employee],
                    ]);
                    console.log(
                         `\n ${updatedManager.employee}'s manager has been updated to ${updatedManager.newManager}\n`
                    );
                    break;
               }
               // COMMENT: View employees by manager
               case "View Employees by Manager": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    viewEmployeesByManager[0].choices = employeeNames;
                    const employeesByManager = await prompt(viewEmployeesByManager);
                    return await eTrackerPrint(sqlViewEmployeesByManager, [employeeMap[employeesByManager.managers]]);
               }

               // COMMENT: View employees by department // TODO: Fix this
               case "View Employees by Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    viewEmployeesByDepartment[0].choices = departmentNames;
                    const employeesByDepartment = await prompt(viewEmployeesByDepartment);
                    return await eTrackerPrint(sqlViewEmployeesByDepartment, [
                         departmentMap[employeesByDepartment.department],
                    ]);
               }
               // COMMENT: Delete a department
               case "Delete a Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    deleteDepartment[0].choices = departmentNames;
                    const deletedDepartment = await prompt(deleteDepartment);
                    await eTrackerExecute(sqlDeleteDepartment, [departmentMap[deletedDepartment.department]]);
                    console.log(`\nThe department has been deleted.\n`);
                    break;
               }

               // COMMENT: Delete a role
               case "Delete a Role": {
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    deleteRole[0].choices = roleTitles;
                    const deletedRole = await prompt(deleteRole);
                    await eTrackerExecute(sqlDeleteRole, [roleMap[deletedRole.role]]);
                    console.log(`\nThe role has been deleted.\n`);
                    break;
               }
               // COMMENT: Delete an employee
               case "Delete an Employee": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    deleteEmployee[0].choices = employeeNames;
                    const deletedEmployee = await prompt(deleteEmployee);
                    await eTrackerExecute(sqlDeleteEmployee, [employeeMap[deletedEmployee.employee]]);
                    console.log(`\nThe employee has been deleted.\n`);
                    break;
               }
               // COMMENT: Quit
               case "Quit":
                    eTracker.end();
                    console.log("\nThank you for using the Employee Tracker. Goodbye!\n");
                    return process.exit(0);
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
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
