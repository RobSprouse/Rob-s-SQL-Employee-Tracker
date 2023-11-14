CREATE DATABASE IF NOT EXISTS employee_tracker;

USE employee_tracker;

CREATE TABLE IF NOT EXISTS department (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(30) NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS role (
     id INT NOT NULL AUTO_INCREMENT,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL NOT NULL,
     department_id INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE IF NOT EXISTS employee (
     id INT NOT NULL AUTO_INCREMENT,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INT NOT NULL,
     manager_id INT DEFAULT NULL,
     PRIMARY KEY (id)
);

SELECT
     employee.id AS employee_id,
     employee.first_name,
     employee.last_name,
     role.title,
     role.salary,
     department.name AS department_name
FROM
     employee
     INNER JOIN role ON employee.role_id = role.id
     INNER JOIN department ON role.department_id = department.id;

SELECT
     employee.id AS employee_id,
     employee.first_name,
     employee.last_name,
     employee.role_id,
     employee.manager_id,
     role.id AS role_id,
     role.title,
     role.salary,
     role.department_id,
     department.id AS department_id,
     department.name AS department_name
FROM
     employee
     INNER JOIN role ON employee.role_id = role.id
     INNER JOIN department ON role.department_id = department.id;

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
WHERE
     department.id = $ { departmentAnswer.departmentId }
INSERT INTO
     department (name)
VALUES
     (?)

     
INSERT INTO
     role (title, salary, department_id)
VALUES
     (?, ?, ?)