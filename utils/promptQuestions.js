// COMMENT: Validations
const validateNoInput = (input) => (input ? true : "This value cannot be empty.");

// COMMENT:Prompt questions
// COMMENT: Parent questions
const options = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to do?",
          choices: [
               "View by Category",
               "Add to the Database",
               "Update the Database",
               "Delete from the Database",
               "Quit",
          ],
     },
];

// COMMENT: View by category questions
const viewByCategory = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to view?",
          choices: [
               "View All Departments",
               "View All Roles",
               "View All Employees",
               "View Employees by Department",
               "View Employees by Manager",
               "Return to Previous Menu",
          ],
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

// COMMENT: Add to database questions
const addToDatabase = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to add?",
          choices: ["Add a Department", "Add a Role", "Add an Employee", "Return to Previous Menu"],
     },
];

const addDepartment = [
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

// COMMENT: Update database questions
const updateDatabase = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to update?",
          choices: ["Update an Employee Role", "Update an Employee's Manager", "Return to Previous Menu"],
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

// COMMENT: Delete from database questions
const deleteFromDatabase = [
     {
          type: "list",
          name: "optionChoices",
          message: "What would you like to delete?",
          choices: ["Delete a Department", "Delete a Role", "Delete an Employee", "Return to Previous Menu"],
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

const q = {
     options: options,
     viewByCategory: viewByCategory,
     addToDatabase: addToDatabase,
     updateDatabase: updateDatabase,
     deleteFromDatabase: deleteFromDatabase,
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

export default q;
