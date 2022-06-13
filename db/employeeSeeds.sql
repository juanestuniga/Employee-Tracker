USE employees_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jason', 'Malone', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Gary', 'Vee', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jack', 'Dorsey', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Elon', 'Musk', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jeff', 'Bezos', 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('David', 'Solomon', 6, null);

INSERT INTO department (department_name)
VALUES ("Sales");
INSERT INTO department (department_name)
VALUES ("Engineering");
INSERT INTO department (department_name)
VALUES ("Finance");
INSERT INTO department (department_name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);