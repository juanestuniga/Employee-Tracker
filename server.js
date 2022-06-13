const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

// connection

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ADD PASSWORD", 
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
      message: "What would you like to do today?",
      name: "action",
      choices: [
              "Add A Department",
              "Add A Role",
              "Add an Employee",
              "View All Employees", 
              "View All Departments",
              "View All Roles",
              "View All Employees by Department",
              "View All Employees by Role",
              "Update An Employee Role",
              "Exit"
              ]
      }
  ]).then(function(answers) {
          switch (answers.action) {
  
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
                  viewEmpByRole();
              break;
  
              case "Add A Department":
                  addDepartment();
              break;

              case "Add A Role":
                  addRole();
              break;
  
              case "Add An Employee":
                  addEmployee();
              break;
  
              case "Update An Employee Role":
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
         
        console.log("EMPLOYEES");
         
        console.table(res)
        startProcess()
    })
  }
  

  function viewDepartments() {
      connection.query("SELECT department.id AS ID, department.name AS Department FROM department",
      function(err, res) {
        if (err) throw err
         
        console.log("DEPARTMENT")
         
        console.table(res)
        startProcess()
    })
  }
  

  function viewRoles() {
      connection.query("SELECT role.id AS Dept_ID, role.title AS Title FROM role",
      function(err, res) {
        if (err) throw err
         
        console.log("ROLE")
         
        console.table(res)
        startProcess()
    })
  }

  function viewEmpByDept() {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, department.name AS Department FROM employees JOIN role ON employees.roleID = role.id JOIN department ON role.departmentID = department.id ORDER BY department.id;", 
    function(err, res) {
      if (err) throw err
       
      console.log("EMPLOYEES LIST BY DEPARTMENT")
       
      console.table(res)
      startProcess()
    })
  }
  

  function viewEmpByRole() {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title FROM employees JOIN role ON employees.roleID = role.id ORDER BY role.id", 
    function(err, res) {
    if (err) throw err
     
    console.log("EMPLOYEES LIST BY ROLE")
     
    console.table(res)
    startProcess()
    })
  }
  

  let  roleArray = [];                                            
  function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
         roleArray.push(res[i].title);
      }
    })
    return  roleArray;
  }
  

  let  managersArray = [];
  function selectManager() {
    connection.query("SELECT firstName, lastName FROM employees", function(err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
         managersArray.push(res[i].firstName);
      }
    })
    return  managersArray;
  }
  

  var  deptArray = [];
  function selectDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
         deptArray.push(res[i].name);
      }
  })
  return  deptArray;
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
            message: "What is the employee's title? ",
            choices: selectRole()
          },
          {
              name: "choice",
              type: "rawlist",
              message: "Who is employee's manager? ",
              choices: selectManager()
          }
  
      ]).then(function (answers) {
        var roleId = selectRole().indexOf(answers.role) + 1
        var managerId = selectManager().indexOf(answers.choice) + 1
        connection.query("INSERT INTO employees SET ?", 
        {
            firstName: answers.firstName,
            lastName: answers.lastName,
            managerID: managerId,
            roleID: roleId
            
        }, 
        function(err){
            if (err) throw err
            console.table(answers)
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
                          var lastName = [];
                          for (var i = 0; i < res.length; i++) {
                              lastName.push(res[i].lastName);
                          }
                          return lastName;
                      },
                      message: "What is the employee's last name? ",
                  },
                  {
                      name: "role",
                      type: "rawlist",
                      message: "What is the employee's title? ",
                      choices: selectRole()
                  },
              ]).then(function (answers) {
                  var roleId = selectRole().indexOf(answers.role) + 1;
                  connection.query("UPDATE employees SET WHERE ?",
                      {
                          lastName: answers.lastName,
                          roleID: roleId
                      },
          
                      function (err) {
                          if (err)
                              throw err;
                          console.table(answers);
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
  
      ]).then(function(answers) {
          connection.query("INSERT INTO department SET ? ",
              {
                name: answers.name,
                id: answers.id
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
              message: "What is name of the new role?"
            },
            {
              name: "salary",
              type: "input",
              message: "What is the salary of the new role?"
            } ,
            {
              name: "department",
              type: "rawlist",
              message: "Which department does this new role fall?",
              choices: selectDepartment()
            }
        ]).then(function(answers) {
            var deptId = selectDepartment().indexOf(answers.choice) + 1
            connection.query(
                "INSERT INTO role SET ?",
                {
                  title: answers.title,
                  salary: answers.salary,
                  departmentID: deptId
                },
                function(err) {
                    if (err) throw err
                    console.table(answers);
                    startProcess();
                }
            )     
        });
      });
  };