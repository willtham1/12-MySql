var mysql = require("mysql2");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Username
    user: "root",
    // Your password
    password: "password",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startTracker();
});

function startTracker() {
  inquirer
  .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
          "Work with Departments",
          "Work with Roles",
          "Work with Employees"
      ]
  }).then(function (answer) {
      switch (answer.action) {
          case "Work with Departments": {
              inquirer
                  .prompt({
                      name: "action",
                      type: "list",
                      message: "What would you like to do with departments?",
                      choices: [
                          "View All Departments",
                          "Add a Department",
                          "Delete a Department"
                      ]
                  }).then(function (answer1) {
                      switch (answer1.action) {
                          case "View All Departments":
                              viewDepartments();
                              break;
                          case "Add a Department":
                              addDepartments();
                              break;
                          case "Delete a Department":
                              deleteDepartments();
                              break;
                      }
                  })
          }
              break;
          case "Work with Roles": {
              inquirer
                  .prompt({
                      name: "action",
                      type: "list",
                      message: "What would you like to do with roles?",
                      choices: [
                          "View All Roles",
                          "Add a Role",
                          "Delete a Role"
                      ]
                  }).then(function (answer2) {
                      switch (answer2.action) {
                          case "View All Roles":
                              viewRoles();
                              break;
                          case "Add a Role":
                              addRole();
                              break;
                          case "Delete a Role":
                              deleteRole()
                              break;
                      }
                  })
          }
              break;
          case "Work with Employees": {
              inquirer
                  .prompt({
                      name: "action",
                      type: "list",
                      message: "What would you like to do with Employees?",
                      choices: [
                          "View All Employees",
                          "Add an Employee",
                          "Delete an Employee",
                          "Update Employee Role",
                      ]
                  }).then(function (answer3) {
                      switch (answer3.action) {
                          case "View All Employees":
                              viewEmployees()
                              break;
                          case "Add an Employee":
                              addEmployee()
                              break;
                          case "Delete an Employee":
                              deleteEmployees()
                              break;
                          case "Update Employee Role":
                            updateRole()
                            break;
                      }
                  })
          }
              break;
      }
  })
}


//Add, View and Delete Departments
function addDepartments() {
    inquirer
        .prompt({
            name: "aName",
            type: "input",
            message: "What is the name of the department?"
        }).then(function (response){
            var sqlQuery = "INSERT INTO departments SET ?"
            connection.query(sqlQuery, {name: response.aName }, function (err, res){
                if (err) throw err;
                console.log(res.affectedRows + " Department Added!\n");
                viewDepartments();
            })
        })

};

function deleteDepartments() {
    var viewDept;

    connection.query("SELECT name FROM departments", function (err, res){
        if (err) throw err;
        var array = res.map(function (obj){
            return obj.name;
        });

        viewDept = array;

        inquirer
            .prompt({
                name: "dName",
                type: "list",
                message: "What is the name of the department you would like to delete?",
                choices: viewDept
            }).then(function (response){
                console.log(response.dName)
                var sqlQuery = "DELETE FROM departments WHERE ?"
                connection.query(sqlQuery, { name: response.dName }, function (err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + " Department deleted!\n");
                    viewDepartments();
                });
            });
    })
};

function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        console.table(res);
        startOver();
    })

};



//Add, Delete and View Roles
function addRole() {
    var currentRole;

    connection.query("SELECT name, id FROM departments", function (err, res) {
        if (err) throw err;
        var array = res.map(function (obj) {
            return { name: obj.name, value: obj.id };
        });

        currentRole = array;
        inquirer
            .prompt([{
                name:  "rName",
                type: "input",
                message: "What is the name of the role?"
            },
            {
                name: "rDept",
                type: "list",
                message: "Which department does this role belong to?",
                choices: currentRole

            },
            {
                name: "rSalary",
                type: "input",
                message: "What is the salary on this role?"
            }
        ]).then(function (response){
            var sqlQuery = "INSERT INTO roles SET ?"
            connection.query(sqlQuery, { title: response.rName, salary: response.rSalary, department_id: response.rDept }, function (err, res){
                if (err) throw err;
                console.log(res.affectedRows + " Role Added!\n");
                viewRoles();
            })
        })
    })
};

function deleteRole(){
    var viewRole;

    connection.query("SELECT title FROM roles", function (err, res){
        if (err) throw err;
        var array = res.map(function (obj){
            return obj.title;
        });

        viewRole = array;

        inquirer
            .prompt({
                name: "dRole",
                type: "list",
                message: "What is the name of the role you would like to delete?",
                choices: viewRole
            }).then(function (response){
                console.log(response.dRole)
                var sqlQuery = "DELETE FROM roles WHERE ?"
                connection.query(sqlQuery, { title: response.dRole }, function (err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + " Role deleted!\n");
                    viewRoles();
                });
            });
    })
}

function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.table(res);
        startOver();
    })
};

//Add, Delete and View Employees
function addEmployee() {
    var currentEmployees
    var currentRoles

    connection.query("Select title, id from roles", function (err, res){
        if (err) throw err;
        var cArray = res.map(function (obj){
            return { name: obj.title, value: obj.id };
        });
        currentRoles = cArray;
    })
    connection.query("SELECT first_name, last_name, id FROM employees", function (err, res) {
        if (err) throw err;
        var eArray = res.map(function (obj) {
            return { name: obj.first_name + " " + obj.last_name, value: obj.id };
        });

        currentEmployees = eArray;

        inquirer
            .prompt([{
                name:  "fName",
                type: "input",
                message: "What is the first name of the new employee?"
            },
            {
                name: "lName",
                type: "input",
                message: "What is the last name of the new employee?",
            },
            {
                name: "eRole",
                type: "list",
                message: "What is the role of this new employee?",
                choices: currentRoles,
            },
            {
                name: "eManager",
                type: "list",
                message: "Who will be the employees manager?",
                choices: currentEmployees,
            },
        ]).then(function (response){
            var sqlQuery = "INSERT INTO employees SET ?"
            connection.query(sqlQuery, { first_name: response.fName, last_name: response.lName, role_id: response.eRole, manager_id: response.eManager}, function (err, res){
                if (err) throw err;
                console.log(res.affectedRows + " Employee has been added!\n");
                viewEmployees();
            });
        });
    });
};
function viewEmployees() {
    connection.query("SELECT * FROM employees", function (err, res) {
        if (err) throw err;
        console.table(res);
        startOver();
    })
};

//Delete Employee
function deleteEmployees() {
    var currentEmployees
    connection.query("SELECT first_name, last_name, id FROM employees", function (err, res){
        if (err) throw err;
        var array = res.map(function (obj){
            return { name: obj.first_name + " " + obj.last_name, value: obj.id };
        });

        currentEmployees = array;

        inquirer
            .prompt({
                name: "dEmp",
                type: "list",
                message: "What is the name of the employee you would like to delete?",
                choices: currentEmployees
            }).then(function (response){
                console.log(response.dEmp)
                var sqlQuery = "DELETE FROM employees WHERE ?"
                connection.query(sqlQuery, { id: response.dEmp }, function (err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + " Employee deleted!\n");
                    startOver();
                });
            });
        });

};

//Update Employee Role
function updateRole() {
    var currentEmployees
    var currentRoles

    connection.query("Select title, id from roles", function (err, res){
        if (err) throw err;
        var cArray = res.map(function (obj){
            return { name: obj.title, value: obj.id };
        });
        currentRoles = cArray;
    })
    connection.query("SELECT first_name, last_name, id FROM employees", function (err, res) {
        if (err) throw err;
        var eArray = res.map(function (obj) {
            return { name: obj.first_name + " " + obj.last_name, value: obj.id };
        });

        currentEmployees = eArray;

        inquirer
            .prompt([
                {
                    name:  "eName",
                    type: "list",
                    message: "Who should be changing roles?",
                    choices: currentEmployees
                },
                {
                    name: "nRole",
                    type: "list",
                    message: "What is their new Role?",
                    choices: currentRoles
                }
            ]).then(function (response) {
                var sqlQuery = "UPDATE employees SET ? WHERE ?";
                connection.query(sqlQuery, [{role_id: response.nRole }, {id: response.eName}], function (err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + " Role has been Changed!\n");
                    viewEmployees()
                })

            })
        });
    };    


//Loop to Start Over
function startOver() {
    inquirer
        .prompt({
            name:  "over",
            type: "confirm",
            message: "Would you like to perform another action?"
        }).then(function(response){
            switch (response.over){
                case true:
                    startTracker();
                    break;
                case false:
                    console.log("Enjoy the rest of the day!")
                    connection.end();
            }
        })
}