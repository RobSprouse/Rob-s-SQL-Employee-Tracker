// COMMENT: SQL Queries for selecting from the database
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
     JOIN 
          department 
     ON 
          role.department_id = department.id`;

const selectAllEmployees = `
     SELECT
          employee.id AS 'Employee ID',
          
          CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name',
          role.title AS ' Role Title',
          department.name AS 'Department',
          role.salary AS 'Salary',
          CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
     FROM
          employee
     LEFT JOIN 
          role ON employee.role_id = role.id
     LEFT JOIN 
          department ON role.department_id = department.id
     LEFT JOIN 
          employee manager ON manager.id = employee.manager_id`;

// COMMENT: SQL Queries for viewing the database
const viewEmployeesByDepartment = `
     SELECT
          employee.id AS 'Employee ID',
          CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name',
          role.title AS 'Role Title',
          department.name AS 'Department',
          role.salary AS 'Salary',
          CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
     FROM 
          employee
     LEFT JOIN 
          role ON employee.role_id = role.id
     LEFT JOIN 
          department ON role.department_id = department.id
     LEFT JOIN 
          employee manager ON manager.id = employee.manager_id
     WHERE 
          department.id = ?`;

const viewEmployeesByManager = `
     SELECT 
          employee.id AS 'Employee ID', 
          CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name',
          role.title AS 'Title', 
          department.name AS 'Department', 
          role.salary AS 'Salary', 
     CONCAT
          (manager.first_name, ' ', manager.last_name) AS 'Manager'
     FROM 
          employee
     LEFT JOIN 
          role ON employee.role_id = role.id
     LEFT JOIN 
          department ON role.department_id = department.id
     LEFT JOIN 
          employee manager ON manager.id = employee.manager_id
     WHERE 
          employee.manager_id = ?`;

// COMMENT: SQL Queries for adding to the database
const addDepartment = `
     INSERT INTO 
          department (name) 
     VALUES (?)`;

const addRole = `
     INSERT INTO 
          role (title, salary, department_id) 
     VALUES 
          (?, ?, ?)`;

const addEmployee = `
     INSERT INTO
          employee (first_name, last_name, role_id, manager_id) 
     VALUES 
          (?, ?, ?, ?)`;

// COMMENT: SQL Queries for updating the database
const updateEmployeeRole = `
     UPDATE 
          employee 
     SET 
          role_id = ? WHERE id = ?`;

const updateEmployeeManager = `
     UPDATE 
          employee 
     SET 
          manager_id = ? WHERE id = ?`;

// COMMENT: SQL Queries for deleting from the database
const deleteDepartment = `
     DELETE FROM 
          department 
     WHERE 
          id = ?`;

const deleteRole = `
     DELETE FROM 
          role 
     WHERE 
          id = ?`;

const deleteEmployee = `
     DELETE FROM 
          employee 
     WHERE 
          id = ?`;

// COMMENT: Adding the SQL Queries to the sql object for ease of use and exporting
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

// COMMENT: Exporting the sql object
export default sql;
