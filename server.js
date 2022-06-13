// dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

// connection

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "20624763", 
  database: "employeedb"
});
// header
connection.connect(function(err) {
    if (err) throw err;
   
    console.log("Connected as ID " + connection.threadId);
    console.clear();
    console.log ("   EMPLOYEE DATABASE   ");
    startProcess();
  });


    // main menu

function startProcess() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "View All Employees", 
            "View All Departments",
            "View All Roles",
            "View All Employees by Department",
            "View All Employees by Role",
            "Update Employee Role",
            "Quit"
            ]
    }

]).then(function(response) {
        switch (response.action) {

            case "View All Employees":
                viewEmployees();
            break;

            case "View All Departments":
                viewDepartments();
            break;

            case "View All Roles":
                viewRoles();
            break;
                
            case "View All Employees by Department":
                viewEmpByDept();
            break;

            case "View All Employees by Role":
                RmployeeByRole();
            break;

            case "Add Department":
                addDepartment();
            break;

            case "Add Role":
                addRole();
            break;

            case "Add Employee":
                addEmployee();
            break;

            case "Update Employee Role":
                updateEmployeeRole();
            break;

            case "Exit":
             
                connection.end();
            break;
            }
    })
};

// functions
function viewEmployees() {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employees INNER JOIN role on role.id = employees.roleID INNER JOIN department on department.id = role.departmentID LEFT JOIN employees e on employees.managerID = e.id;", 
    function(err, res) {
      if (err) throw err
      console.log ("");
      console.log("EMPLOYEES");
      console.log ("");
      console.table(res)
      startProcess()
  })
}
function viewDepartments() {
    connection.query("SELECT department.id AS ID, department.name AS Department FROM department",
    function(err, res) {
      if (err) throw err
      console.log("")
      console.log("DEPARTMENTS")
      console.log("")
      console.table(res)
      startProcess()
  })
}
function viewRoles() {
    connection.query("SELECT role.id AS Dept_ID, role.title AS Title FROM role",
    function(err, res) {
      if (err) throw err
      console.log("")
      console.log("ROLES")
      console.log("")
      console.table(res)
      startProcess()
  })
}
function viewEmpByDept() {
  connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, department.name AS Department FROM employees JOIN role ON employees.roleID = role.id JOIN department ON role.departmentID = department.id ORDER BY department.id;", 
  function(err, res) {
    if (err) throw err
    console.log ("");
    console.log("EMPLOYEES LIST BY DEPARTMENT")
    console.log ("");
    console.table(res)
    startProcess()
  })
}
function RmployeeByRole() {
  connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title FROM employees JOIN role ON employees.roleID = role.id ORDER BY role.id", 
  function(err, res) {
  if (err) throw err
  console.log ("");
  console.log("EMPLOYEES LIST BY ROLE")
  console.log ("");
  console.table(res)
  startProcess()
  })
}
let roleArr = [];                                            
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  })
  return roleArr;
}
let managersArr = [];
function selectManager() {
  connection.query("SELECT firstName, lastName FROM employees", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      managersArr.push(res[i].firstName);
    }
  })
  return managersArr;
}
let deptArr = [];
function selectDepartment() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      deptArr.push(res[i].name);
    }
})
return deptArr;
}
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "First Name: "
        },
        {
          name: "lastName",
          type: "input",
          message: "Last Name: "
        },
        {
          name: "role",
          type: "list",
          message: "What is the title for the employee? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Who is the employee's manager? ",
            choices: selectManager()
        }

    ]).then(function (response) {
      let roleId = selectRole().indexOf(response.role) + 1
      let managerId = selectManager().indexOf(response.choice) + 1
      connection.query("INSERT INTO employees SET ?", 
      {
          firstName: response.firstName,
          lastName: response.lastName,
          managerID: managerId,
          roleID: roleId
          
      }, 
      function(err){
          if (err) throw err
          console.table(response)
          startProcess()
      })

  })
 }
function updateEmployeeRole() {
    connection.query("SELECT employees.lastName, role.title FROM employees JOIN role ON employees.roleID = role.id;", 
    (err, res) => {
            if (err) throw err;
 
            inquirer.prompt([
                {
                    name: "lastName",
                    type: "rawlist",
                    choices: function () {
                        let lastName = [];
                        for (let i = 0; i < res.length; i++) {
                            lastName.push(res[i].lastName);
                        }
                        return lastName;
                    },
                    message: "What is the last name of employee? ",
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "What is the new title for employee? ",
                    choices: selectRole()
                },
            ]).then(function (response) {
                let roleId = selectRole().indexOf(response.role) + 1;
                connection.query("UPDATE employees SET WHERE ?",
                    {
                        lastName: response.lastName,
                        roleID: roleId
                    },
        
                    function (err) {
                        if (err)
                            throw err;
                        console.table(response);
                        startProcess();
                    });
            });
        });
  }
function addDepartment() { 
    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department are you adding? "
        },
        {
            name: "id",
            type: "input",
            message: "What is the new Department ID number? "
          }

    ]).then(function(response) {
        connection.query("INSERT INTO department SET ? ",
            {
              name: response.name,
              id: response.id
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startProcess();
            }
        )
    })
  }
  function addRole() { 
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role LEFT JOIN department.name AS Department FROM department;",   function(err, res) {
      inquirer.prompt([
          {
            name: "title",
            type: "input",
            message: "What is the new role?"
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?"
          } ,
          {
            name: "department",
            type: "rawlist",
            message: "Whhich department for this role?",
            choices: selectDepartment()
          }
      ]).then(function(response) {
          let deptId = selectDepartment().indexOf(response.choice) + 1
          connection.query(
              "INSERT INTO role SET ?",
              {
                title: response.title,
                salary: response.salary,
                departmentID: deptId
              },
              function(err) {
                  if (err) throw err
                  console.table(response);
                  startProcess();
              }
          )     
      });
    });
};
