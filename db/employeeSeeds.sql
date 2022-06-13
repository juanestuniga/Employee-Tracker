INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('John', 'Smith', 1, null);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('Jason', 'Malone', 2, 1);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('Gary', 'Vee', 2, 1);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('Jack', 'Dorsey', 4, 1);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('Elon', 'Musk', 3, 1);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('Jeff', 'Bezos', 5, 1);
INSERT INTO employees (firstName, lastName, roleID, managerID)
VALUES ('David', 'Solomon', 6, null);

INSERT INTO department (id, name)
VALUES (1,"Sales");
INSERT INTO department (id, name)
VALUES (2, "Engineering");
INSERT INTO department (id, name)
VALUES (3, "Finance");
INSERT INTO department (id, name)
VALUES (4, "Legal");

INSERT INTO role (title, salary, departmentID)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, departmentID)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, departmentID)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, departmentID)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, departmentID)
VALUES ("Legal Team Lead", 250000, 4);