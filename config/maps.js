import { eTrackerExecute } from "../config/connection.js";
import sql from "../config/sqlQueries.js";

// COMMENT:Map functions
async function getDepartmentNamesAndMap() {
     try {
          const [res, fields] = await eTrackerExecute(sql.selectAllDepartments);
          const departmentNames = res.map((res) => res["Department Name"]);
          const departmentMap = res.reduce((map, obj) => {
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
          const [res, fields] = await eTrackerExecute(sql.selectAllRoles);
          const roleTitles = res.map((res) => res["Role Title"]);
          const roleMap = res.reduce((map, obj) => {
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
          const res = await eTrackerExecute(sql.selectAllEmployees);
          const employeeNames = res[0].map((res) => res["First Name"] + " " + res["Last Name"]);
          const employeeMap = res[0].reduce((map, obj) => {
               map[obj["First Name"] + " " + obj["Last Name"]] = obj["Employee ID"];
               return map;
          }, {});
          return { employeeNames, employeeMap };
     } catch (err) {
          console.log("The getEmployeeNamesAndMap function has caused an error: " + err);
     }
}

export { getDepartmentNamesAndMap, getRoleTitlesAndMap, getEmployeeNamesAndMap}