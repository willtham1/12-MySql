use employee_db;

insert into departments (name) values ("HR"), ("IT");
insert into roles (title, salary, department_id) values ("Manager", 90, 1), ("Supervisor", 60, 2);
insert into employees (first_name, last_name, role_id, manager_id) values ("Will", "Tham", 3, 6);