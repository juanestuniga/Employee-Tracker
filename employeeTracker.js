// list of dependencies
const mysql = require ('mysql')
const inquirer = require("inquirer");
const dbUtil = require("./dbFiles/dbUtil.js");
const dbQueryUtil = require("./dbFiles/dbUtil.js");
const consoleTable = require("console.table");

// mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", //Enter your MySQL password here.
    database: "employees_db"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
     
      console.log("Connected as ID " + connection.threadId);
      console.clear();
      console.log ("======================================");
      console.log ("");
      console.log ("   WELCOME TO THE EMPLOYEE DATABASE   ");
      console.log ("");
      console.log ("======================================");
      init();
    });

function init() {
  inquirer
    .prompt({
      type: "list",
      message: "What will you like to do today?",
      name: "action",
      choices: [
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Update An Employee Role",
        "Delete An Employee",
        "Delete A Role",
        "Delete A Department",
        "Quit",
      ],

    })
    .then((answer) => {
      console.log(answer);
      switch (answer.option) {
        case "View All Employees":
          return viewAllEmployees();
        case "View All Roles":
          return viewAllRoles();
        case "View All Departments":
          return viewAllDepartments();
        case "Add An Employee":
          return addEmployee();
        case "Add A Role":
          return addRole();
        case "Add A Department":
          return addDepartment();
        case "Update An Employee Role":
          return updateEmployee();
        case "Delete An Employee":
          return deleteEmployee();
        case "Delete A Role":
          return deleteRole();
        case "Delete A Department":
          return deleteDepartment();
        case "Exit":
          return quit();
      }
    });
}
// view employees
async function viewAllEmployees() {
  const employees = await dbQueryUtil.getAllEmployees();
  console.table(employees);
  init();
}
// view roles
async function viewAllRoles() {
  const role = await dbQueryUtil.viewAllRoles();
  console.table(role);
  init();
}
// view departments
async function viewAllDepartments() {
  const departments = await dbQueryUtil.viewAllDepartments();
  console.table(departments);
  init();
}
// add department
async function addDepartment() {
  const department = await inquirer.prompt({
    type: "input",
    message: "Department's name?",
    name: "name",
  });
  await dbQueryUtil.createDepartment(department);
  init();
}
// add employee
async function addEmployee() {
  const rolesOptions = await dbUtil.viewAllRoles();
  const managerOptions = await dbUtil.getAllEmployees();

  const employeeToAdd = await inquirer.prompt([
    {
      type: "input",
      message: "What's the employee's first name",
      name: "first_name",
    },
    {
      type: "input",
      message: "What's the employee's last name?",
      name: "last_name",
    },
  ]);

  var roleChoicesList = rolesOptions.map(({ id, title }) => ({ name: title, value: id }));


  const  {roleId}  = await inquirer.prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoicesList,
  });

  const managerChoicesList = managerOptions.map(({ first_name, last_name, id }) => ({ name: first_name + last_name, value: id }));
  if (managerChoicesList && managerChoicesList.length > 0){
  const { managerId } = await inquirer.prompt({
    
    type: "list",
    name: "managerId",
    message: "Select the employee's manager:",
    choices: managerChoicesList,
      
  });
  employeeToAdd.manager_id = managerId;
  }
  
  employeeToAdd.role_id = roleId;
  

  await dbUtil.createEmployee(employeeToAdd);

  init();
}

// add role
async function addRole() {
  const departments = await dbQueryUtil.viewAllDepartments();
  const departmentsList = departments.map(({ id, name }) => ({ name: name, value: id }));

  const roleToAdd = await inquirer.prompt([
    {
      type: "input",
      message: "What's the role?",
      name: "title",
    },
    {
      type: "input",
      message: "What is the salary?",
      name: "salary",
    },
    {
      type: "list",
      message: "What is the department id number?",
      name: "department_id",
      choices: departmentsList,
    },
  ]);

  await dbQueryUtil.addRole(roleToAdd);
  init();
}

// updating employees
async function updateEmployee() {
  const employeeOptions = await dbUtil.getAllEmployees();

  const rolesOptions = await dbUtil.viewAllRoles();
  console.log(rolesOptions);

  const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + last_name,
    value: id,
  }));

  const rolesOptionsToChooseFrom = rolesOptions.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to change:",
      choices: employeeOptionsToChooseFrom,
    },
  ]);

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the new role?",
      choices: rolesOptionsToChooseFrom,
    },
  ]);

  await dbUtil.updateEmployeeRole(employeeId, roleId);
  init();
}

// deleting employees
async function deleteEmployee() {
  const employeeOptions = await dbUtil.getAllEmployees();

  const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + last_name,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to delete?",
      choices: employeeOptionsToChooseFrom,
    },
  ]);
  await dbUtil.removeEmployee(employeeId);
  init();
}
// delete role
async function deleteRole() {
  const rolesOptions = await dbUtil.viewAllRoles();

  const rolesOptionsToChooseFrom = rolesOptions.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role would you like to delete?",
      choices: rolesOptionsToChooseFrom,
    },
  ]);

  await dbUtil.removeRole(roleId);
  init();
}
// delete department
async function deleteDepartment() {
  const departmentOptions = await dbUtil.viewAllDepartments();

  const departmentOptionsToChooseFrom = departmentOptions.map(({ id, name }) => ({ name: name, value: id }));

  const { departmentId } = await inquirer.prompt({
    type: "list",
    name: "departmentId",
    message: "Which department would you like to delete?",
    choices: departmentOptionsToChooseFrom,
  });
  await dbUtil.removeDepartment(departmentId);
  init();
}
function quit() {
  process.exit();
}