// COMMENT: Imports the required modules
import inquirer from "inquirer";
import { eTracker, eTrackerPrint, eTrackerExecute } from "../config/connection.js";
import { getDepartmentNamesAndMap, getRoleTitlesAndMap, getEmployeeNamesAndMap } from "./maps.js";
import q from "./promptQuestions.js";
import sql from "./sqlQueries.js";

// COMMENT: Defines prompt to simplify the inquirer.prompt function
const prompt = inquirer.prompt;

// COMMENT: Main menu switch/case function
// COMMENT: Handles the choices made by the user. Their choice is then passed to the appropriate switch/case function. If the user chooses to quit, the connection and the program ends.
async function optionsHandler(optionChoices) {
     try {
          switch (optionChoices) {
               case "View by Category": {
                    const answer = await prompt(q.viewByCategory);
                    await viewByCategory(answer.optionChoices);
                    return;
               }
               case "Add to the Database": {
                    const answer = await prompt(q.addToDatabase);
                    await addToDatabase(answer.optionChoices);
                    return;
               }
               case "Update the Database": {
                    const answer = await prompt(q.updateDatabase);
                    await updateDatabase(answer.optionChoices);
                    return;
               }
               case "Delete from the Database": {
                    const answer = await prompt(q.deleteFromDatabase);
                    await deleteFromDatabase(answer.optionChoices);
                    return;
               }
               case "Quit":
                    eTracker.end();
                    console.log("\nThank you for using the Employee Tracker. Goodbye!\n");
                    return process.exit(0);
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
     }
}

/* COMMENT: View by category switch/case function
     - Handles the user's choice when taken to the "View by Category" menu. Their choice is then passed to the corresponding prompt if necessary, then to the corresponding SQL query and printed to the console. 
     - If the user chooses to return to the previous menu, they are returned to the main menu.
     - The map functions are used to dynamically populate the prompt choices with the names of the departments and employees from the database.
     - This first switch/case function has comments within it to describe what is happening. The following functions follow the same format. */
async function viewByCategory(optionChoices) {
     try {
          switch (optionChoices) {
               case "View All Departments":
                    return await eTrackerPrint(sql.selectAllDepartments);
               case "View All Roles":
                    return eTrackerPrint(sql.selectAllRoles);
               case "View All Employees":
                    return eTrackerPrint(sql.selectAllEmployees);
               case "View Employees by Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.viewEmployeesByDepartment[0].choices = departmentNames;
                    const employeesByDepartment = await prompt(q.viewEmployeesByDepartment);
                    return await eTrackerPrint(sql.viewEmployeesByDepartment, [
                         departmentMap[employeesByDepartment.department],
                    ]);
               }
               case "View Employees by Manager": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    q.viewEmployeesByManager[0].choices = employeeNames;
                    const employeesByManager = await prompt(q.viewEmployeesByManager);
                    return await eTrackerPrint(sql.viewEmployeesByManager, [employeeMap[employeesByManager.managers]]);
               }

               case "Return to Previous Menu":
                    return;
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
     }
}

/* COMMENT: Add to database switch/case function
     - Handles the user's choice when taken to the "Add to Database" menu. Their choice prompts the corresponding question then executes an SQL query. Prints to show confirmation. 
     - If the user chooses to return to the previous menu, they are returned to the main menu.
     - The map functions are used to dynamically populate the prompt choices with the names of the departments, roles, and employees from the database. */
async function addToDatabase(optionChoices) {
     try {
          switch (optionChoices) {
               case "Add a Department": {
                    const addDepartment = await prompt(q.addDepartment);
                    console.log("\n");
                    const res = await eTrackerExecute(sql.addDepartment, [addDepartment.departmentName]);
                    console.log(res);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllDepartments);
                    console.log(`\nThe department ${addDepartment.departmentName} has been added to the database.\n`);
                    break;
               }
               case "Add a Role": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.addRole[2].choices = departmentNames;
                    const addedRole = await prompt(q.addRole);
                    const res = await eTrackerExecute(sql.addRole, [
                         addedRole.roleName,
                         addedRole.roleSalary,
                         departmentMap[addedRole.departmentName],
                    ]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllRoles);
                    console.log(
                         `\nThe role ${addedRole.roleName} has been added in the ${addedRole.departmentName} department.\n`
                    );
                    return;
               }
               case "Add an Employee": {
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    q.addEmployee[2].choices = roleTitles;
                    q.addEmployee[3].choices = employeeNames;
                    employeeNames.unshift("None");
                    const addedEmployee = await prompt(q.addEmployee);
                    const res = await eTrackerExecute(sql.addEmployee, [
                         addedEmployee.addFirstName,
                         addedEmployee.addLastName,
                         roleMap[addedEmployee.roleTitles],
                         addedEmployee.employeeManager === "None" ? null : employeeMap[addedEmployee.employeeManager],
                    ]);
                    console.log(res);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllEmployees);
                    console.log(
                         `\nThe employee ${addedEmployee.addFirstName} ${addedEmployee.addLastName} has been added to the database.\n`
                    );
                    break;
               }
               case "Return to Previous Menu":
                    return;
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
     }
}

/* COMMENT: Update the database switch/case function
     - Handles the user's choice when taken to the "Update the Database" menu. Their choice prompts the corresponding question then executes an SQL query. If the user chooses to return to the previous menu, they are returned to the main menu.
     - The map functions are used to dynamically populate the prompt choices with the names of the employees from the database. */

async function updateDatabase(optionChoices) {
     try {
          switch (optionChoices) {
               case "Update an Employee Role": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    q.updateEmployeeRole[0].choices = employeeNames;
                    q.updateEmployeeRole[1].choices = roleTitles;
                    const updatedEmployee = await prompt(q.updateEmployeeRole);
                    const res = await eTrackerExecute(sql.updateEmployeeRole, [
                         roleMap[updatedEmployee.newRoleTitle],
                         employeeMap[updatedEmployee.employeeName],
                    ]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllEmployees);
                    console.log(
                         `\nThe ${updatedEmployee.employeeName}'s role has been updated to: ${updatedEmployee.newRoleTitle}\n`
                    );
                    break;
               }
               case "Update an Employee's Manager": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    q.updateEmployeeManager[0].choices = employeeNames;
                    q.updateEmployeeManager[1].choices = employeeNames;
                    const updatedManager = await prompt(q.updateEmployeeManager);
                    const res = await eTrackerExecute(sql.updateEmployeeManager, [
                         employeeMap[updatedManager.newManager],
                         employeeMap[updatedManager.employee],
                    ]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllEmployees);
                    console.log(
                         `\n ${updatedManager.employee}'s manager has been updated to ${updatedManager.newManager}\n`
                    );
                    break;
               }
               case "Return to Previous Menu":
                    return;
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
     }
}

/* COMMENT: Delete from the database switch/case function
     - Handles the user's choice when taken to the "Delete from the Database" menu. Their choice prompts the corresponding question then executes an SQL query. If the user chooses to return to the previous menu, they are returned to the main menu.
     - The map functions are used to dynamically populate the prompt choices with the names of the departments, roles, and employees from the database. */
async function deleteFromDatabase(optionChoices) {
     try {
          switch (optionChoices) {
               case "Delete a Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.deleteDepartment[0].choices = departmentNames;
                    const deletedDepartment = await prompt(q.deleteDepartment);
                    const res = await eTrackerExecute(sql.deleteDepartment, [
                         departmentMap[deletedDepartment.department],
                    ]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllDepartments);
                    console.log(`\nThe department has been deleted.\n`);
                    break;
               }
               case "Delete a Role": {
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    q.deleteRole[0].choices = roleTitles;
                    const deletedRole = await prompt(q.deleteRole);
                    const res = await eTrackerExecute(sql.deleteRole, [roleMap[deletedRole.role]]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllRoles);
                    console.log(`\nThe role has been deleted.\n`);
                    break;
               }
               case "Delete an Employee": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    q.deleteEmployee[0].choices = employeeNames;
                    const deletedEmployee = await prompt(q.deleteEmployee);
                    const res = await eTrackerExecute(sql.deleteEmployee, [employeeMap[deletedEmployee.employee]]);
                    if (res.includes(null)) {
                         break;
                    }
                    await eTrackerPrint(sql.selectAllEmployees);
                    console.log(`\nThe employee has been deleted.\n`);
                    break;
               }
               case "Return to Previous Menu":
                    return;
          }
     } catch (err) {
          console.error("The switch/case function has caused an error: " + err);
     }
}

// COMMENT: Exports the functions
export { prompt, optionsHandler };
