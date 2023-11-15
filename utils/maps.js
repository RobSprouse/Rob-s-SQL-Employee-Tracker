// COMMENT: Imports the required modules
import { eTrackerExecute } from "../config/connection.js";
import sql from "./sqlQueries.js";

// COMMENT: The following functions are used to obtain the names of departments, roles, and employees from the database and map them to their respective IDs.
async function getDepartmentNamesAndMap() {
     try {
          const [rows, fields] = await eTrackerExecute(sql.selectAllDepartments);
          const departmentNames = rows.map((rows) => rows["Department Name"]);
          const departmentMap = rows.reduce((map, obj) => {
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
          const [rows, fields] = await eTrackerExecute(sql.selectAllRoles);
          const roleTitles = rows.map((rows) => rows["Role Title"]);
          const roleMap = rows.reduce((map, obj) => {
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
          const [rows, fields] = await eTrackerExecute(sql.selectAllEmployees);
          const employeeNames = rows.map((rows) => rows["Employee Name"]);
          const employeeMap = rows.reduce((map, obj) => {
               map[obj["Employee Name"]] = obj["Employee ID"];
               return map;
          }, {});
          return { employeeNames, employeeMap };
     } catch (err) {
          console.log("The getEmployeeNamesAndMap function has caused an error: " + err);
     }
}

// COMMENT: Exports the functions
export { getDepartmentNamesAndMap, getRoleTitlesAndMap, getEmployeeNamesAndMap };
