// COMMENT: SQL Queries
const selectAllDepartments = `
     SELECT
          department.id AS 'Department ID',
          department.name AS 'Department Name'
     FROM
          department`;
const selectAllRoles = `
     SELECT
          role.id AS 'Role ID',
          role.title AS 'Role Title',
          department.name AS 'Department Name',
          role.salary AS 'Salary'
     FROM
          role
          JOIN department ON role.department_id = department.id`;
const selectAllEmployees = `
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

const addDepartment = `
     INSERT INTO 
          department (name) 
     VALUES (?)`;
const addRole = `
     INSERT INTO 
          role (title, salary, department_id) 
     VALUES 
          (?, ?, ?)`;
const addEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
const updateEmployeeRole = `UPDATE employee SET role_id = ? WHERE id = ?`;
const updateEmployeeManager = `UPDATE employee SET manager_id = ? WHERE id = ?`;
const viewEmployeesByManager = `
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
const viewEmployeesByDepartment = `
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
const deleteDepartment = `DELETE FROM department WHERE id = ?`;
const deleteRole = `DELETE FROM role WHERE id = ?`;
const deleteEmployee = `DELETE FROM employee WHERE id = ?`;

const sql = {
     selectAllDepartments: selectAllDepartments,
     selectAllRoles: selectAllRoles,
     selectAllEmployees: selectAllEmployees,
     addDepartment: addDepartment,
     addRole: addRole,
     addEmployee: addEmployee,
     updateEmployeeRole: updateEmployeeRole,
     updateEmployeeManager: updateEmployeeManager,
     viewEmployeesByManager: viewEmployeesByManager,
     viewEmployeesByDepartment: viewEmployeesByDepartment,
     deleteDepartment: deleteDepartment,
     deleteRole: deleteRole,
     deleteEmployee: deleteEmployee,
};   

export default sql;
