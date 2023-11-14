import inquirer from "inquirer";
import { eTracker, eTrackerPrint, eTrackerExecute } from "./connection.js";
import { getDepartmentNamesAndMap, getRoleTitlesAndMap, getEmployeeNamesAndMap } from "./maps.js";
import q from "./questions.js";
import sql from "./sqlQueries.js";

const prompt = inquirer.prompt;

// COMMENT: Setup connection and database

// COMMENT: Handler function
async function optionsHandler(optionChoices) {
     try {
          switch (optionChoices) {
               // COMMENT: View all departments
               case "View All Departments":
                    return eTrackerPrint(sql.selectAllDepartments);
               // COMMENT: View all roles
               case "View All Roles":
                    return eTrackerPrint(sql.selectAllRoles);
               // COMMENT: View all employees
               case "View All Employees":
                    return eTrackerPrint(sql.selectAllEmployees);
               // COMMENT: Add a department
               case "Add a Department": {
                    const addDepartment = await prompt(q.departmentName);
                    eTrackerExecute(sql.addDepartment, [addDepartment.departmentName]);
                    console.log(`\nThe department ${addDepartment.departmentName} has been added to the database.\n`);
                    break;
               }
               // COMMENT: Add a role
               case "Add a Role": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.addRole[2].choices = departmentNames;
                    const addedRole = await prompt(q.addRole);
                    await eTrackerExecute(sql.addRole, [
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
                    q.addEmployee[2].choices = roleTitles;
                    q.addEmployee[3].choices = employeeNames;
                    employeeNames.unshift("None");
                    const addedEmployee = await prompt(q.addEmployee);
                    await eTrackerExecute(sql.addEmployee, [
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
                    q.updateEmployeeRole[0].choices = employeeNames;
                    q.updateEmployeeRole[1].choices = roleTitles;
                    const updatedEmployee = await prompt(q.updateEmployeeRole);
                    await eTrackerExecute(sql.updateEmployeeRole, [
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
                    q.updateEmployeeManager[0].choices = employeeNames;
                    q.updateEmployeeManager[1].choices = employeeNames;
                    const updatedManager = await prompt(q.updateEmployeeManager);
                    await eTrackerExecute(sql.updateEmployeeManager, [
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
                    q.viewEmployeesByManager[0].choices = employeeNames;
                    const employeesByManager = await prompt(q.viewEmployeesByManager);
                    return await eTrackerPrint(sql.viewEmployeesByManager, [employeeMap[employeesByManager.managers]]);
               }

               // COMMENT: View employees by department
               case "View Employees by Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.viewEmployeesByDepartment[0].choices = departmentNames;
                    const employeesByDepartment = await prompt(q.viewEmployeesByDepartment);
                    return await eTrackerPrint(sql.viewEmployeesByDepartment, [
                         departmentMap[employeesByDepartment.department],
                    ]);
               }
               // COMMENT: Delete a department
               case "Delete a Department": {
                    let { departmentNames, departmentMap } = await getDepartmentNamesAndMap();
                    q.deleteDepartment[0].choices = departmentNames;
                    const deletedDepartment = await prompt(q.deleteDepartment);
                    await eTrackerExecute(sql.deleteDepartment, [departmentMap[deletedDepartment.department]]);
                    console.log(`\nThe department has been deleted.\n`);
                    break;
               }

               // COMMENT: Delete a role
               case "Delete a Role": {
                    let { roleTitles, roleMap } = await getRoleTitlesAndMap();
                    q.deleteRole[0].choices = roleTitles;
                    const deletedRole = await prompt(q.deleteRole);
                    await eTrackerExecute(sql.deleteRole, [roleMap[deletedRole.role]]);
                    console.log(`\nThe role has been deleted.\n`);
                    break;
               }
               // COMMENT: Delete an employee
               case "Delete an Employee": {
                    let { employeeNames, employeeMap } = await getEmployeeNamesAndMap();
                    q.deleteEmployee[0].choices = employeeNames;
                    const deletedEmployee = await prompt(q.deleteEmployee);
                    await eTrackerExecute(sql.deleteEmployee, [employeeMap[deletedEmployee.employee]]);
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

export { prompt, optionsHandler };
