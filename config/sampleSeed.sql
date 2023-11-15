/* COMMENT: Schema to insert example SEED data */
DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE IF NOT EXISTS department (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(30) NOT NULL,
     PRIMARY KEY (id)
) 

CREATE TABLE IF NOT EXISTS role (
     id INT NOT NULL AUTO_INCREMENT,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL NOT NULL,
     department_id INT,
     PRIMARY KEY (id),
     FOREIGN KEY (department_id) REFERENCES department(id)
) 

CREATE TABLE IF NOT EXISTS employee (
     id INT NOT NULL AUTO_INCREMENT,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INT,
     manager_id INT DEFAULT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (role_id) REFERENCES role(id),
     FOREIGN KEY (manager_id) REFERENCES employee(id)
)


INSERT INTO
     department (name)
VALUES
     ('Sales'),
     ('Engineering'),
     ('Finance'),
     ('Legal');

INSERT INTO
     role (
          title,
          salary,
          department_id
     )
VALUES
     ('Sales Lead', 100000, 1),
     ('Salesperson', 80000, 1),
     ('Lead Engineer', 150000, 2),
     ('Software Engineer', 120000, 2),
     ('Accountant', 125000, 3),
     ('Legal Team Lead', 250000, 4),
     ('Lawyer', 190000, 4);

INSERT INTO
     employee (
          first_name,
          last_name,
          role_id,
          manager_id
     )
VALUES
     ('John', 'Doe', 1, NULL),
     ('Jane', 'Smith', 2, 1),
     ('Emily', 'Johnson', 3, NULL),
     ('Michael', 'Brown', 4, NULL),
     ('Sarah', 'Davis', 5, 4),
     ('Mike', 'Jones', 6, NULL),
     ('Jennifer', 'Jackson', 7, 6);