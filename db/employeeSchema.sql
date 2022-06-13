
DROP DATABASE IF EXISTS employeedb;

CREATE DATABASE employeedb;
USE employeedb;


CREATE TABLE employees (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR (30),
  lastName VARCHAR (30),
  roleID INT,
  managerID INT
);


CREATE TABLE department (
  id INT(11) PRIMARY KEY,
  name VARCHAR (30)
);


CREATE TABLE role (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR (30),
  salary DECIMAL(10,0),
  departmentID INT
);