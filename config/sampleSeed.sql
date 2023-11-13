DROP DATABASE IF EXISTS employee_tracker;

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
     department_id INT,
     PRIMARY KEY (id),
     FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE IF NOT EXISTS employee (
     id INT NOT NULL AUTO_INCREMENT,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INT,
     manager_id INT DEFAULT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (role_id) REFERENCES role(id),
     FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO
     department (name)
VALUES
     ('Sales'),
     ('Engineering'),
     ('HR');

INSERT INTO
     role (title, salary, department_id)
VALUES
     ('Sales Manager', 80000, 1),
     ('Sales Associate', 60000, 1),
     ('Engineer', 90000, 2),
     ('HR Manager', 85000, 3),
     ('HR Associate', 65000, 3);

INSERT INTO
     employee (first_name, last_name, role_id, manager_id)
VALUES
     ('John', 'Doe', 1, NULL),
     ('Jane', 'Smith', 2, 1),
     ('Emily', 'Johnson', 3, NULL),
     ('Michael', 'Brown', 4, NULL),
     ('Sarah', 'Davis', 5, 4);

SELECT
     *
FROM
     employee;

SELECT
     department.id AS 'Department ID',
     department.name AS 'Department Name'
FROM
     department
SELECT
     role.id AS 'Role ID',
     role.title AS 'Role Title',
     department.name AS 'Department Name',
     role.salary AS 'Salary'
FROM
     role
     JOIN department ON role.department_id = department.id

     
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

