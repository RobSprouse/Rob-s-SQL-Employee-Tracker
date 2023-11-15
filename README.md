# Rob's-SQL-Employee-Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This repository was created as a part of the University of Richmond's Bootcamp, Module 12 Challenge. This application will allow the user to view, add, and update employees, roles, and departments to a MySql database.

The following node modules are utilized in the deployment of this project:
`Inquirer, MySQL2`

The following User Story and Acceptance Criteria were provided for this challenge:

> ## User Story
>
> ```md
> AS A business owner
> I WANT to be able to view and manage the departments, roles, and employees in my company
> SO THAT I can organize and plan my business
> ```
>
> ## Acceptance Criteria
>
> ```md
> GIVEN a command-line application that accepts user input
> WHEN I start the application
> THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
> WHEN I choose to view all departments
> THEN I am presented with a formatted table showing department names and department ids
> WHEN I choose to view all roles
> THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
> WHEN I choose to view all employees
> THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees >report to
> WHEN I choose to add a department
> THEN I am prompted to enter the name of the department and that department is added to the database
> WHEN I choose to add a role
> THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
> WHEN I choose to add an employee
> THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
> WHEN I choose to update an employee role
> THEN I am prompted to select an employee to update and their new role and this information is updated in the database
> ```

## Table of Contents

-    [Installation](#installation)
-    [Usage](#usage)
-    [License](#license)
-    [Contributing](#contributing)
-    [Tests](#tests)
-    [Questions](#questions)

## Installation

This application requires Node.js to run. Please visit https://nodejs.org/en/ to download Node.js if it is not already installed on your computer.

This application depends on connecting to an existing MySql server, either locally or over the internet. Please visit https://dev.mysql.com/downloads/mysql/ to download MySQL if it is not already installed on your computer. Once your computer hosts the MySql server, you can modify the connection parameters in the `db/connection.js` file to connect to your server.

If you are unfamiliar with cloning a repository, please click on the following link to learn: [Github docs | Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

To install this application, clone the repository, navigate to its directory in the terminal, and run `npm install` in the command line to install the required dependencies.

If you want to interact with a database that contains sample seeded data, run the `sampleSeed.sql` schema file located in the `config` directory to create the database and tables with seeded data. This file will drop the employee_tracker database if it already exists, so be careful if you have already created the database and want to keep the data. If you are unfamiliar with running MySql scripts, please click on the following link to learn: [MySQL docs | Executing SQL Statements from a Text File](https://dev.mysql.com/doc/refman/8.0/en/mysql-batch-commands.html)

## Usage

After following the installation instructions, while still in the applications directory within the terminal, run `npm start` in the command line to start the application. This will create an `employee_tracker` database on your MySql server, if it doesn't exist, and populate it with the tables `department`, `role`, and `employee`, if they don't exist. The application will then prompt you with a series of questions to view, add, delete, and update employees, roles, and departments.

The following image shows the database schema:

> <img src="screenshots/database schema.jpg">

The following video shows an example of the application being used from the command line:

<!-- TODO: Add video-->

## License

This application is licensed under the MIT license. See the following link for more information: https://opensource.org/licenses/MIT

## Contributing

Feel free to contribute to this project! Please fork the repository and create a pull request with your changes.

## Tests

No tests are included in this application.

## Questions

If you have any questions, please contact me at drgstriker@aol.com. You can also visit my GitHub profile at https://github.com/RobSprouse.
